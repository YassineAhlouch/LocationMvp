<?php

namespace App\Services\Reports;

use App\Enums\CarStatus;
use App\Enums\ExpenseStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Payment;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Read-only analytics for the dashboard and reporting surfaces.
 *
 * Money conventions (stated once, used everywhere):
 *  - Revenue is cash-basis: paid payment records bucketed by payment_date.
 *    Pending/refunded amounts are reported separately, never mixed into "in".
 *  - Expenses are cash-basis too: paid records by paid_date. Outstanding
 *    (pending) bills booked in the period are exposed as exposure.
 *  - Occupancy counts one unit per "day a car is on hire" (nights), measured
 *    as diffInDays between pickup and return; the denominator is
 *    fleet_cars × calendar days in the period.
 *
 * All queries ride the BelongsToAgency global scope — no cross-agency leaks.
 */
final class ReportingService
{
    /**
     * @return array<string, mixed>
     */
    public function summary(CarbonInterface $from, CarbonInterface $to): array
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $revenue = [
            'paid' => $this->sumPayments(PaymentRecordStatus::Paid, $range),
            'pending' => $this->sumPayments(PaymentRecordStatus::Pending, $range),
            'refunded' => $this->sumPayments(PaymentRecordStatus::Refunded, $range),
        ];
        $revenue['net'] = round($revenue['paid'] - $revenue['refunded'], 2);

        $expensesPaid = $this->money(
            CarExpense::query()
                ->where('status', ExpenseStatus::Paid)
                ->whereBetween('paid_date', $range)
                ->sum('amount'),
        );

        $expensesPending = $this->money(
            CarExpense::query()
                ->where('status', ExpenseStatus::Pending)
                ->whereBetween('created_at', $range)
                ->sum('amount'),
        );

        $expenses = [
            'paid' => $expensesPaid,
            'pending' => $expensesPending,
            'total' => round($expensesPaid + $expensesPending, 2),
            'overdue_count' => CarExpense::query()
                ->where('status', ExpenseStatus::Pending)
                ->whereDate('due_date', '<', today())
                ->count(),
        ];

        $fleet = $this->fleet();

        return [
            'period' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'revenue' => $revenue,
            'expenses' => $expenses,
            'net' => round($revenue['net'] - $expenses['total'], 2),
            'reservations' => $this->reservations($range),
            'fleet' => $fleet,
            'occupancy' => $this->occupancy($fleet['total_cars'], $from, $to, $range),
        ];
    }

    /**
     * Revenue vs. expenses per calendar month, oldest → newest.
     *
     * @return array{months: array<int, string>, revenue: array<int, float>, expenses: array<int, float>}
     */
    public function timeline(int $months): array
    {
        $start = today()->startOfMonth()->subMonths($months - 1);
        $end = today()->endOfMonth();

        $labels = [];
        for ($i = 0; $i < $months; $i++) {
            $labels[] = $start->copy()->addMonths($i)->format('Y-m');
        }
        $indexByLabel = array_flip($labels);

        $revenue = array_fill(0, $months, 0.0);
        $expenses = array_fill(0, $months, 0.0);

        foreach ($this->monthlyPaidPayments($start, $end) as $month => $total) {
            $revenue[$indexByLabel[$month]] = $total;
        }

        foreach ($this->monthlyPaidExpenses($start, $end) as $month => $total) {
            $expenses[$indexByLabel[$month]] = $total;
        }

        return [
            'months' => $labels,
            'revenue' => $revenue,
            'expenses' => $expenses,
        ];
    }

    /**
     * Per-car profitability for the period — every agency car, zero-filled,
     * ranked by margin so the owner sees at a glance which cars earn.
     *
     * @return array<int, array<string, mixed>>
     */
    public function cars(CarbonInterface $from, CarbonInterface $to): array
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $revenueByCar = Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereBetween('payment_date', $range)
            ->with('reservation:id,car_id')
            ->get(['id', 'reservation_id', 'amount'])
            ->groupBy(fn (Payment $payment) => $payment->reservation?->car_id)
            ->map(fn (Collection $group) => round((float) $group->sum('amount'), 2));

        $expensesByCar = CarExpense::query()
            ->where('status', ExpenseStatus::Paid)
            ->whereNotNull('paid_date')
            ->whereBetween('paid_date', $range)
            ->get(['car_id', 'amount'])
            ->groupBy('car_id')
            ->map(fn (Collection $group) => round((float) $group->sum('amount'), 2));

        $bookedDaysByCar = $this->bookedDaysPerCar($from, $to);

        return Car::query()
            ->with(['brand:id,name', 'model:id,name'])
            ->get()
            ->map(function (Car $car) use ($revenueByCar, $expensesByCar, $bookedDaysByCar): array {
                $revenue = $revenueByCar->get($car->id, 0.0);
                $expenses = $expensesByCar->get($car->id, 0.0);

                return [
                    'car_id' => $car->id,
                    'registration_number' => $car->registration_number,
                    'brand' => $car->brand?->name,
                    'model' => $car->model?->name,
                    'revenue' => $revenue,
                    'expenses' => $expenses,
                    'margin' => round($revenue - $expenses, 2),
                    'booked_days' => $bookedDaysByCar->get($car->id, 0),
                ];
            })
            ->sortByDesc('margin')
            ->values()
            ->all();
    }

    /**
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function reservations(array $range): array
    {
        $counts = Reservation::query()
            ->whereBetween('pickup_datetime', $range)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $byStatus = collect(ReservationStatus::cases())
            ->mapWithKeys(fn (ReservationStatus $status) => [$status->value => (int) ($counts[$status->value] ?? 0)])
            ->all();

        return [
            'by_status' => $byStatus,
            'total' => array_sum($byStatus),
            'currently_active' => Reservation::query()
                ->where('status', ReservationStatus::Active)
                ->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function fleet(): array
    {
        $byStatus = collect(CarStatus::cases())
            ->mapWithKeys(fn (CarStatus $status) => [$status->value => 0])
            ->all();

        foreach (Car::query()->selectRaw('status, count(*) as total')->groupBy('status')->get() as $car) {
            $byStatus[$car->status->value] = (int) $car->total;
        }

        return [
            'total_cars' => array_sum($byStatus),
            'by_status' => $byStatus,
            'currently_rented' => Reservation::query()
                ->where('status', ReservationStatus::Active)
                ->distinct()
                ->count('car_id'),
        ];
    }

    /**
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function occupancy(int $totalCars, CarbonInterface $from, CarbonInterface $to, array $range): array
    {
        $bookedDays = 0;
        $reservations = Reservation::query()
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['pickup_datetime', 'expected_return_datetime']);

        foreach ($reservations as $reservation) {
            // A hire occupies the nights from pickup through the day before
            // return (same unit as the pricing engine: 10→13 is 3 nights).
            $occupiedStart = $reservation->pickup_datetime->copy()->startOfDay();
            $occupiedEnd = $reservation->expected_return_datetime->copy()->startOfDay()->subDay();

            $overlapStart = $occupiedStart->copy()->max($from);
            $overlapEnd = $occupiedEnd->copy()->min($to);

            if ($overlapEnd->lt($overlapStart)) {
                continue;
            }

            $bookedDays += $overlapStart->diffInDays($overlapEnd) + 1;
        }

        $availableDays = $totalCars * $this->periodDays($from, $to);

        return [
            'rate' => $availableDays > 0 ? round($bookedDays / $availableDays, 4) : 0.0,
            'booked_days' => $bookedDays,
            'available_days' => $availableDays,
        ];
    }

    /**
     * @param  array{CarbonInterface, CarbonInterface}  $range
     */
    private function sumPayments(PaymentRecordStatus $status, array $range): float
    {
        return $this->money(
            Payment::query()
                ->where('status', $status)
                ->whereBetween('payment_date', $range)
                ->sum('amount'),
        );
    }

    private function money(float $value): float
    {
        return round($value, 2);
    }

    /**
     * Calendar days between period bounds (inclusive). Uses explicit
     * start-of-day copies and abs(): Carbon 3's diffInDays is signed and can
     * carry sub-day float noise otherwise.
     */
    private function periodDays(CarbonInterface $from, CarbonInterface $to): int
    {
        return (int) abs($to->copy()->startOfDay()->diffInDays($from->copy()->startOfDay())) + 1;
    }

    /**
     * Paid payments bucketed by month (cash basis) — one portable query per
     * month-range, grouped in PHP so MySQL (DATE_FORMAT) and the SQLite test
     * runner (strftime) don't diverge.
     *
     * @return array<string, float>
     */
    private function monthlyPaidPayments(CarbonInterface $start, CarbonInterface $end): array
    {
        $totals = [];

        foreach (Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereBetween('payment_date', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])
            ->get(['payment_date', 'amount']) as $payment) {
            $month = $payment->payment_date->format('Y-m');
            $totals[$month] = ($totals[$month] ?? 0.0) + (float) $payment->amount;
        }

        return $this->rounded($totals);
    }

    /**
     * Paid expenses bucketed by month (cash basis).
     *
     * @return array<string, float>
     */
    private function monthlyPaidExpenses(CarbonInterface $start, CarbonInterface $end): array
    {
        $totals = [];

        foreach (CarExpense::query()
            ->where('status', ExpenseStatus::Paid)
            ->whereNotNull('paid_date')
            ->whereBetween('paid_date', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])
            ->get(['paid_date', 'amount']) as $expense) {
            $month = $expense->paid_date->format('Y-m');
            $totals[$month] = ($totals[$month] ?? 0.0) + (float) $expense->amount;
        }

        return $this->rounded($totals);
    }

    /**
     * @param  array<string, float>  $totals
     * @return array<string, float>
     */
    private function rounded(array $totals): array
    {
        return array_map(fn (float $total) => round($total, 2), $totals);
    }

    /**
     * Hired days per car within a period. Overlap is clamped to the period
     * and bookable statuses are used — cancelled reservations never count.
     *
     * @return Collection<int, int>
     */
    private function bookedDaysPerCar(CarbonInterface $from, CarbonInterface $to): Collection
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $days = [];
        $reservations = Reservation::query()
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['car_id', 'pickup_datetime', 'expected_return_datetime']);

        foreach ($reservations as $reservation) {
            $occupiedStart = $reservation->pickup_datetime->copy()->startOfDay();
            $occupiedEnd = $reservation->expected_return_datetime->copy()->startOfDay()->subDay();

            $overlapStart = $occupiedStart->copy()->max($from);
            $overlapEnd = $occupiedEnd->copy()->min($to);

            if ($overlapEnd->lt($overlapStart)) {
                continue;
            }

            $days[$reservation->car_id] = ($days[$reservation->car_id] ?? 0)
                + $overlapStart->diffInDays($overlapEnd) + 1;
        }

        return collect($days);
    }
}
