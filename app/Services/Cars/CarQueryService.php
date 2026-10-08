<?php

namespace App\Services\Cars;

use App\Enums\CarStatus;
use App\Enums\ExpenseStatus;
use App\Enums\FuelType;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Enums\TransmissionType;
use App\Models\ActivityLog;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\ReservationChange;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Read side of the fleet module. The agency global scope applies
 * automatically (BelongsToAgency); brands/models/categories are matched via
 * correlated EXISTS subqueries so the page's COUNT stays exact.
 */
class CarQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexCarRequest.
     */
    private const SORTABLE = [
        'daily_price',
        'year',
        'created_at',
        'registration_number',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     status?: string,
     *     category_id?: int,
     *     brand_id?: int,
     *     fuel_type?: string,
     *     transmission_type?: string,
     *     seats_count?: int,
     *     is_active?: bool,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Car::query()
            ->with([
                'brand:id,name',
                'model:id,name',
                'category:id,name',
                'images',
            ])
            ->withCount('images')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', CarStatus::from($status)))
            ->when($filters['category_id'] ?? null, fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($filters['brand_id'] ?? null, fn ($query, $brandId) => $query->where('brand_id', $brandId))
            ->when($filters['fuel_type'] ?? null, fn ($query, $fuel) => $query->where('fuel_type', FuelType::from($fuel)))
            ->when($filters['transmission_type'] ?? null, fn ($query, $transmission) => $query->where('transmission_type', TransmissionType::from($transmission)))
            ->when($filters['seats_count'] ?? null, fn ($query, $seats) => $query->where('seats_count', $seats))
            // NB: array_key_exists, not when($value) — is_active=false is a
            // legitimate filter and when(false, ...) would silently skip it.
            ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
            ->when($filters['q'] ?? null, fn ($query, $term) => self::applySearch($query, $term))
            ->orderBy(self::sortBy($filters['sort_by'] ?? null), self::sortDir($filters['sort_dir'] ?? null))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * Lifetime operational + financial summary for one car, plus a zero-filled
     * 12-month paid revenue vs. paid expenses trend. Same money conventions as
     * ReportingService: cash-basis, paid records only, with pending and
     * refunded amounts exposed separately rather than mixed into "in".
     *
     * @return array<string, mixed>
     */
    public function overview(Car $car): array
    {
        $reservations = Reservation::query()
            ->where('car_id', $car->id)
            ->get(['id', 'status', 'rental_days', 'pickup_datetime']);

        $byStatus = [];
        $bookedDays = 0;
        $active = 0;
        $upcoming = 0;

        foreach ($reservations as $reservation) {
            $status = $reservation->status;
            $byStatus[$status->value] = ($byStatus[$status->value] ?? 0) + 1;

            if ($status === ReservationStatus::Active) {
                $active++;
            }

            if (! in_array($status, [ReservationStatus::Cancelled, ReservationStatus::NoShow], true)) {
                $bookedDays += (int) $reservation->rental_days;
            }

            if (in_array($status, [ReservationStatus::Confirmed, ReservationStatus::Reserved], true)
                && $reservation->pickup_datetime?->isFuture()) {
                $upcoming++;
            }
        }

        $payments = Payment::query()
            ->whereHas('reservation', fn ($query) => $query->where('car_id', $car->id))
            ->get(['amount', 'status', 'payment_date']);

        $revenue = ['paid' => 0.0, 'pending' => 0.0, 'refunded' => 0.0];
        $monthlyRevenue = [];

        foreach ($payments as $payment) {
            $revenue[$payment->status->value] += (float) $payment->amount;

            if ($payment->status === PaymentRecordStatus::Paid && $payment->payment_date !== null) {
                $month = $payment->payment_date->format('Y-m');
                $monthlyRevenue[$month] = ($monthlyRevenue[$month] ?? 0.0) + (float) $payment->amount;
            }
        }

        $revenue = array_map(fn (float $value) => round($value, 2), $revenue);
        $revenue['net'] = round($revenue['paid'] - $revenue['refunded'], 2);

        $expenses = CarExpense::query()
            ->where('car_id', $car->id)
            ->get(['amount', 'status', 'type', 'paid_date', 'due_date']);

        $expensesPaid = 0.0;
        $expensesPending = 0.0;
        $overdue = 0;
        $byType = [];
        $monthlyExpenses = [];

        foreach ($expenses as $expense) {
            $amount = (float) $expense->amount;
            $type = $expense->type->value;

            $byType[$type] = [
                'type' => $type,
                'amount' => round(($byType[$type]['amount'] ?? 0.0) + $amount, 2),
                'count' => ($byType[$type]['count'] ?? 0) + 1,
            ];

            if ($expense->status === ExpenseStatus::Paid) {
                $expensesPaid += $amount;

                if ($expense->paid_date !== null) {
                    $month = $expense->paid_date->format('Y-m');
                    $monthlyExpenses[$month] = ($monthlyExpenses[$month] ?? 0.0) + $amount;
                }

                continue;
            }

            $expensesPending += $amount;

            if ($expense->due_date?->isBefore(today())) {
                $overdue++;
            }
        }

        $expensesPaid = round($expensesPaid, 2);
        $expensesPending = round($expensesPending, 2);

        $byType = array_values($byType);
        usort($byType, fn (array $a, array $b) => $b['amount'] <=> $a['amount']);

        return [
            'reservations' => [
                'total' => $reservations->count(),
                'by_status' => $byStatus,
                'active' => $active,
                'upcoming' => $upcoming,
                'booked_days' => $bookedDays,
                'last_pickup_at' => $reservations->max('pickup_datetime')?->toIso8601String(),
            ],
            'revenue' => $revenue,
            'expenses' => [
                'paid' => $expensesPaid,
                'pending' => $expensesPending,
                'total' => round($expensesPaid + $expensesPending, 2),
                'count' => $expenses->count(),
                'overdue_count' => $overdue,
                'by_type' => $byType,
            ],
            'net' => round($revenue['net'] - ($expensesPaid + $expensesPending), 2),
            'timeline' => $this->carTimeline($monthlyRevenue, $monthlyExpenses),
        ];
    }

    /**
     * Latest reservations for the car (newest pickup first) for the overview.
     *
     * @return Collection<int, Reservation>
     */
    public function recentReservations(Car $car, int $limit = 5): Collection
    {
        return Reservation::query()
            ->where('car_id', $car->id)
            ->with(['car', 'primaryClient', 'secondaryClient', 'createdBy', 'approvedBy'])
            ->orderByDesc('pickup_datetime')
            ->limit($limit)
            ->get();
    }

    /**
     * Latest expenses for the car (newest first) for the overview.
     *
     * @return Collection<int, CarExpense>
     */
    public function recentExpenses(Car $car, int $limit = 5): Collection
    {
        return CarExpense::query()
            ->where('car_id', $car->id)
            ->with(['car', 'createdBy'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Merged, newest-first audit trail for one car: the vehicle's own activity
     * (fleet module) plus every business change recorded on its reservations
     * (reservation_changes). Both shapes are normalised so the UI renders a
     * single timeline.
     *
     * @return array<int, array<string, mixed>>
     */
    public function history(Car $car, int $limit = 200): array
    {
        $activity = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('entity_type', $car->getMorphClass())
            ->where('entity_id', $car->id)
            ->with('user:id,first_name,last_name')
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => 'car-'.$log->id,
                'source' => 'car',
                'action' => $log->action,
                'description' => $log->description,
                'user' => $log->user !== null ? [
                    'id' => $log->user->id,
                    'full_name' => $log->user->full_name,
                ] : null,
                'created_at' => $log->created_at?->toIso8601String(),
            ]);

        $changes = ReservationChange::query()
            ->whereHas('reservation', fn ($query) => $query->where('car_id', $car->id))
            ->with(['createdBy:id,first_name,last_name', 'reservation:id,reservation_number'])
            ->get()
            ->map(fn (ReservationChange $change) => [
                'id' => 'reservation-'.$change->id,
                'source' => 'reservation',
                'reservation' => $change->reservation !== null ? [
                    'id' => $change->reservation->id,
                    'reservation_number' => $change->reservation->reservation_number,
                ] : null,
                'change_type' => $change->change_type?->value,
                'field_name' => $change->field_name,
                'old_value' => $change->old_value,
                'new_value' => $change->new_value,
                'reason' => $change->reason,
                'user' => $change->createdBy !== null ? [
                    'id' => $change->createdBy->id,
                    'full_name' => $change->createdBy->full_name,
                ] : null,
                'created_at' => $change->created_at?->toIso8601String(),
            ]);

        return $activity
            ->concat($changes)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values()
            ->all();
    }

    /**
     * Zero-filled months (oldest → newest) of paid revenue vs. paid expenses
     * for one car, keyed by the cash-basis date each record carries.
     *
     * @param  array<string, float>  $revenue
     * @param  array<string, float>  $expenses
     * @return array{labels: array<int, string>, revenue: array<int, float>, expenses: array<int, float>}
     */
    private function carTimeline(array $revenue, array $expenses, int $months = 12): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1);

        $labels = [];
        $revenueSeries = [];
        $expensesSeries = [];

        for ($i = 0; $i < $months; $i++) {
            $label = $start->copy()->addMonths($i)->format('Y-m');
            $labels[] = $label;
            $revenueSeries[] = round($revenue[$label] ?? 0.0, 2);
            $expensesSeries[] = round($expenses[$label] ?? 0.0, 2);
        }

        return [
            'labels' => $labels,
            'revenue' => $revenueSeries,
            'expenses' => $expensesSeries,
        ];
    }

    private static function applySearch($query, string $term): void
    {
        $like = '%'.trim($term).'%';

        $query->where(function ($builder) use ($like) {
            $builder->where('registration_number', 'like', $like)
                ->orWhere('vin', 'like', $like)
                ->orWhere(fn ($brand) => $brand->whereExists(
                    fn ($exists) => $exists->from('brands')
                        ->whereColumn('brands.id', 'cars.brand_id')
                        ->where('brands.name', 'like', $like),
                ))
                ->orWhere(fn ($model) => $model->whereExists(
                    fn ($exists) => $exists->from('car_models')
                        ->whereColumn('car_models.id', 'cars.model_id')
                        ->where('car_models.name', 'like', $like),
                ))
                ->orWhere(fn ($category) => $category->whereExists(
                    fn ($exists) => $exists->from('car_categories')
                        ->whereColumn('car_categories.id', 'cars.category_id')
                        ->where('car_categories.name', 'like', $like),
                ));
        });
    }

    private static function sortBy(?string $value): string
    {
        return in_array($value, self::SORTABLE, true) ? $value : 'created_at';
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }
}
