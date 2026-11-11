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
use App\Models\User;
use Carbon\CarbonImmutable;
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
     * Creation/deletion audit rows snapshot the whole entity; these are the
     * fields worth showing so such a row stays one glance tall.
     */
    private const HISTORY_HEADLINE_FIELDS = [
        'fleet' => ['registration_number', 'daily_price', 'purchase_price', 'status'],
        'expenses' => ['type', 'title', 'amount', 'status', 'due_date'],
        'payments' => ['amount', 'method', 'status'],
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
     * Operational + financial summary for one car, plus a zero-filled paid
     * revenue vs. paid expenses trend. When no window is given the summary is
     * the vehicle's lifetime and the trend covers the last 12 months. With a
     * from/to window every figure is scoped to it: reservations by pickup,
     * payments by payment date (falling back to creation) and expenses by
     * paid date, then due date, then creation — the cash-basis pivot dates.
     * Same money conventions as ReportingService: paid records only, with
     * pending and refunded amounts exposed separately rather than mixed.
     *
     * @return array<string, mixed>
     */
    public function overview(Car $car, ?CarbonImmutable $from = null, ?CarbonImmutable $to = null): array
    {
        $ranged = $from !== null && $to !== null;

        $reservations = Reservation::query()
            ->where('car_id', $car->id)
            ->when($ranged, fn ($query) => $query->whereBetween(
                'pickup_datetime',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
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
            ->when($ranged, fn ($query) => $query->whereRaw(
                'COALESCE(payment_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
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
            ->when($ranged, fn ($query) => $query->whereRaw(
                'COALESCE(paid_date, due_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
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
            'timeline' => $this->carTimeline($monthlyRevenue, $monthlyExpenses, $from, $to),
        ];
    }

    /**
     * Latest reservations for the car (newest pickup first) for the overview.
     * When a window is given only pickups inside it are listed.
     *
     * @return Collection<int, Reservation>
     */
    public function recentReservations(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
        int $limit = 5,
    ): Collection {
        return Reservation::query()
            ->where('car_id', $car->id)
            ->when($from !== null && $to !== null, fn ($query) => $query->whereBetween(
                'pickup_datetime',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
            ->with(['car', 'primaryClient', 'secondaryClient', 'createdBy', 'approvedBy'])
            ->orderByDesc('pickup_datetime')
            ->limit($limit)
            ->get();
    }

    /**
     * Latest expenses for the car for the overview. When a window is given
     * only expenses whose cash-basis pivot date (paid date, then due date,
     * then creation) falls inside it are listed, matching the scoped stats.
     *
     * @return Collection<int, CarExpense>
     */
    public function recentExpenses(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
        int $limit = 5,
    ): Collection {
        return CarExpense::query()
            ->where('car_id', $car->id)
            ->when($from !== null && $to !== null, fn ($query) => $query->whereRaw(
                'COALESCE(paid_date, due_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
            ->with(['car', 'createdBy'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Merged, newest-first audit trail for one car: the vehicle's own activity
     * (fleet module, with the exact field diffs), every expense movement on it
     * (expenses module), every payment event on its reservations (payments
     * module) and every business change recorded on its reservations
     * (reservation_changes). All shapes are normalised so the UI renders a
     * single timeline. When a window is given only entries created inside it
     * are kept.
     *
     * @return array<int, array<string, mixed>>
     */
    public function history(
        Car $car,
        int $limit = 200,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): array {
        $ranged = $from !== null && $to !== null;
        $window = fn ($query) => $ranged
            ? $query->whereBetween('created_at', [$from->toDateTimeString(), $to->toDateTimeString()])
            : $query;

        $withUser = fn ($query) => $query->with('user:id,first_name,last_name');

        // Movements on the vehicle itself: creation, edits (with the exact
        // field diff), retirement.
        $activity = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('entity_type', $car->getMorphClass())
            ->where('entity_id', $car->id)
            ->when($ranged, $window)
            ->tap($withUser)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => 'car-'.$log->id,
                'source' => 'car',
                'action' => $log->action,
                'changes' => $this->diffChanges('fleet', $log->action, $log->old_values, $log->new_values),
                'description' => $log->description,
                'user' => $this->entryUser($log->user),
                'created_at' => $log->created_at?->toIso8601String(),
            ]);

        // Money spent on this car: expense creations and edits (with diffs).
        $expenseIds = CarExpense::query()
            ->where('car_id', $car->id)
            ->pluck('id');
        $expenseTitles = CarExpense::query()
            ->whereKey($expenseIds)
            ->pluck('title', 'id');

        $expenseActivity = $expenseIds->isEmpty()
            ? collect()
            : ActivityLog::query()
                ->where('module', 'expenses')
                ->where('entity_type', (new CarExpense)->getMorphClass())
                ->whereIn('entity_id', $expenseIds)
                ->when($ranged, $window)
                ->tap($withUser)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'id' => 'expense-'.$log->id,
                    'source' => 'expense',
                    'action' => $log->action,
                    'expense' => [
                        'id' => (int) $log->entity_id,
                        'title' => $expenseTitles[$log->entity_id] ?? null,
                    ],
                    'changes' => $this->diffChanges('expenses', $log->action, $log->old_values, $log->new_values),
                    'user' => $this->entryUser($log->user),
                    'created_at' => $log->created_at?->toIso8601String(),
                ]);

        // Money received for this car: payment events on its reservations.
        $reservations = Reservation::query()
            ->where('car_id', $car->id)
            ->get(['id', 'reservation_number']);
        $paymentNumbers = $reservations->pluck('reservation_number', 'id');
        $paymentReservations = $reservations->pluck('id', 'id');
        $paymentIds = $paymentReservations->isEmpty()
            ? collect()
            : Payment::query()->whereIn('reservation_id', $paymentReservations)->pluck('id');

        $paymentActivity = $paymentIds->isEmpty()
            ? collect()
            : ActivityLog::query()
                ->where('module', 'payments')
                ->where('entity_type', (new Payment)->getMorphClass())
                ->whereIn('entity_id', $paymentIds)
                ->when($ranged, $window)
                ->tap($withUser)
                ->get()
                ->map(fn (ActivityLog $log) => [
                    'id' => 'payment-'.$log->id,
                    'source' => 'payment',
                    'action' => $log->action,
                    'payment' => [
                        'id' => (int) $log->entity_id,
                        'reservation_id' => $paymentReservations->get((int) $log->entity_id),
                        'reservation_number' => $paymentNumbers->get((int) $log->entity_id),
                    ],
                    'changes' => $this->diffChanges('payments', $log->action, $log->old_values, $log->new_values),
                    'user' => $this->entryUser($log->user),
                    'created_at' => $log->created_at?->toIso8601String(),
                ]);

        // Business changes recorded on the car's reservations (pricing edits,
        // extensions, status moves...) with their field-level detail.
        $changes = ReservationChange::query()
            ->whereHas('reservation', fn ($query) => $query->where('car_id', $car->id))
            ->when($ranged, $window)
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
            ->concat($expenseActivity)
            ->concat($paymentActivity)
            ->concat($changes)
            ->sortByDesc('created_at')
            ->take($limit)
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>|null  $old
     * @param  array<string, mixed>|null  $new
     * @return array<int, array{field: string, old: string|null, new: string|null}>
     */
    private function diffChanges(string $module, string $action, ?array $old, ?array $new): array
    {
        if ($old === null && $new === null) {
            return [];
        }

        $fields = array_values(array_unique(array_merge(
            array_keys($old ?? []),
            array_keys($new ?? []),
        )));

        // Creations and deletions snapshot the whole row — keep only the
        // headline fields so a created/removed entry stays one glance tall.
        // Updates carry only the touched keys, so the full diff is shown.
        if ($action !== 'updated') {
            $headline = self::HISTORY_HEADLINE_FIELDS[$module] ?? [];

            if ($headline !== []) {
                $fields = array_values(array_intersect($fields, $headline));
            }
        }

        $changes = [];

        foreach ($fields as $field) {
            $before = array_key_exists($field, $old ?? []) ? $old[$field] : null;
            $after = array_key_exists($field, $new ?? []) ? $new[$field] : null;

            if ($before === null && $after === null) {
                continue;
            }

            if ($action === 'updated' && $before === $after) {
                continue;
            }

            $changes[] = [
                'field' => $field,
                'old' => $before === null ? null : (string) $before,
                'new' => $after === null ? null : (string) $after,
            ];
        }

        return $changes;
    }

    /**
     * @return array{id: int, full_name: string}|null
     */
    private function entryUser(?User $user): ?array
    {
        return $user !== null
            ? ['id' => $user->id, 'full_name' => $user->full_name]
            : null;
    }

    /**
     * Zero-filled months (oldest → newest) of paid revenue vs. paid expenses
     * for one car, keyed by the cash-basis date each record carries.
     *
     * @param  array<string, float>  $revenue
     * @param  array<string, float>  $expenses
     * @return array{labels: array<int, string>, revenue: array<int, float>, expenses: array<int, float>}
     */
    private function carTimeline(
        array $revenue,
        array $expenses,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): array {
        $ranged = $from !== null && $to !== null;
        $start = ($ranged ? $from : now())->startOfMonth();
        $months = $ranged
            ? (int) min(
                24,
                max(1, (int) $from->startOfMonth()->diffInMonths($to->startOfMonth()) + 1),
            )
            : 12;

        $labels = [];
        $revenueSeries = [];
        $expensesSeries = [];

        for ($i = 0; $i < $months; $i++) {
            $label = $start->addMonths($i)->format('Y-m');
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
