<?php

namespace App\Services\Reports;

use App\Enums\CarStatus;
use App\Enums\ExpenseStatus;
use App\Enums\KpiMetric;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
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
     * Records a KPI drill-down ships. The page says how many more exist
     * (rows_total) and links to the full list — the payload stays bounded
     * even for a busy year.
     */
    private const DETAIL_ROW_LIMIT = 200;

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
            'outstanding' => $this->outstanding(),
            'today' => $this->today(),
            'attention' => $this->fleetAttention(),
            'new_clients' => $this->newClients($range),
        ];
    }

    /**
     * Drill-down behind one dashboard card: the headline the card shows, the
     * segments that explain it, the series for its chart and the records
     * underneath. The period semantics are summary()'s own, so the number on
     * the detail page always ties back to the card it came from.
     *
     * Every payload carries:
     *  - headline: the card's value plus its components;
     *  - breakdown: [{key, value, count?}] segments for the pie/table;
     *  - trend:     {labels, count[]} daily series (where a day series makes
     *               sense — money metrics reuse the payment trend);
     *  - rows:      the underlying records, most relevant first, capped at
     *               DETAIL_ROW_LIMIT with rows_total carrying the real count.
     *
     * @return array<string, mixed>
     */
    public function kpiDetail(KpiMetric $metric, CarbonInterface $from, CarbonInterface $to): array
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $detail = match ($metric) {
            KpiMetric::NetRevenue => $this->netRevenueDetail($range),
            KpiMetric::Expenses => $this->expensesDetail($range),
            KpiMetric::Reservations => $this->reservationsDetail($range),
            KpiMetric::Occupancy => $this->occupancyDetail($range, $from, $to),
            KpiMetric::Outstanding => $this->outstandingDetail(),
            KpiMetric::Today => $this->todayDetail(),
            KpiMetric::FleetAttention => $this->fleetAttentionDetail(),
            KpiMetric::NewClients => $this->newClientsDetail($range),
        };

        return array_merge([
            'metric' => $metric->value,
            'period' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ], $detail);
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
     * Payment-centric overview for the payments ledger page: period totals,
     * per-status counts and a zero-filled daily trend (cash basis, bucketed
     * by payment_date). Same money conventions as summary().
     *
     * @return array<string, mixed>
     */
    public function paymentOverview(CarbonInterface $from, CarbonInterface $to): array
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $totals = [
            'paid' => $this->sumPayments(PaymentRecordStatus::Paid, $range),
            'pending' => $this->sumPayments(PaymentRecordStatus::Pending, $range),
            'refunded' => $this->sumPayments(PaymentRecordStatus::Refunded, $range),
        ];
        $totals['net'] = round($totals['paid'] - $totals['refunded'], 2);

        $counts = [
            'paid' => $this->countPayments(PaymentRecordStatus::Paid, $range),
            'pending' => $this->countPayments(PaymentRecordStatus::Pending, $range),
            'refunded' => $this->countPayments(PaymentRecordStatus::Refunded, $range),
        ];
        $counts['total'] = array_sum($counts);

        return [
            'period' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'totals' => $totals,
            'counts' => $counts,
            'trend' => $this->dailyPaymentTrend($from, $to),
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
     * Per-client performance for the period, ranked by revenue so the owner
     * sees who brings the business. Revenue is cash-basis paid payments on the
     * client's reservations; booked days use the same nights convention as
     * cars(). Reservations counted are those whose hire window overlaps the
     * period.
     *
     * @return array<int, array<string, mixed>>
     */
    public function clients(CarbonInterface $from, CarbonInterface $to): array
    {
        $range = [$from->copy()->startOfDay(), $to->copy()->endOfDay()];

        $revenueByClient = Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereBetween('payment_date', $range)
            ->with('reservation:id,primary_client_id')
            ->get(['id', 'reservation_id', 'amount'])
            ->groupBy(fn (Payment $payment) => $payment->reservation?->primary_client_id)
            ->map(fn (Collection $group) => round((float) $group->sum('amount'), 2));

        $reservationsByClient = Reservation::query()
            ->whereNotNull('primary_client_id')
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
                ReservationStatus::Reserved,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['primary_client_id', 'pickup_datetime', 'expected_return_datetime'])
            ->groupBy('primary_client_id');

        $clients = Client::query()
            ->whereIn('id', $reservationsByClient->keys()->all())
            ->get()
            ->keyBy('id');

        $periodStart = $from->copy()->startOfDay();
        $periodEnd = $to->copy()->startOfDay();

        return $reservationsByClient
            ->map(function (Collection $group, $clientId) use ($clients, $periodStart, $periodEnd, $revenueByClient): array {
                $bookedDays = 0;
                $lastRental = null;

                foreach ($group as $reservation) {
                    $occupiedStart = $reservation->pickup_datetime->copy()->startOfDay();
                    $occupiedEnd = $reservation->expected_return_datetime->copy()->startOfDay()->subDay();

                    $overlapStart = $occupiedStart->copy()->max($periodStart);
                    $overlapEnd = $occupiedEnd->copy()->min($periodEnd);

                    if ($overlapEnd->gte($overlapStart)) {
                        $bookedDays += $overlapStart->diffInDays($overlapEnd) + 1;
                    }

                    if ($lastRental === null || $reservation->pickup_datetime->gt($lastRental)) {
                        $lastRental = $reservation->pickup_datetime;
                    }
                }

                $revenue = (float) ($revenueByClient[$clientId] ?? 0);
                $count = $group->count();
                $client = $clients->get($clientId);

                return [
                    'client_id' => (int) $clientId,
                    'full_name' => $client?->full_name,
                    'phone' => $client?->phone,
                    'email' => $client?->email,
                    'status' => $client?->status?->value,
                    'reservations' => $count,
                    'booked_days' => $bookedDays,
                    'revenue' => $revenue,
                    'average_spend' => $count > 0 ? round($revenue / $count, 2) : 0.0,
                    'last_rental' => $lastRental?->toDateString(),
                ];
            })
            ->sortByDesc('revenue')
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
                ReservationStatus::Reserved,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['pickup_datetime', 'expected_return_datetime']);

        foreach ($reservations as $reservation) {
            $nights = $this->occupiedNights(
                $reservation->pickup_datetime,
                $reservation->expected_return_datetime,
                $from,
                $to,
            );

            if ($nights === null) {
                continue;
            }

            $bookedDays += $nights[0]->diffInDays($nights[1]) + 1;
        }

        $availableDays = $totalCars * $this->periodDays($from, $to);

        return [
            'rate' => $availableDays > 0 ? round($bookedDays / $availableDays, 4) : 0.0,
            'booked_days' => $bookedDays,
            'available_days' => $availableDays,
        ];
    }

    /**
     * Money still owed on the bookings: every reservation whose total exceeds
     * the sum of its paid payments. Cancelled hires are excluded — nothing is
     * owed on a cancelled booking.
     *
     * This is a stock (a point-in-time position), not a flow, so it is
     * deliberately independent of the selected period: the owner always wants
     * to know the total debt, not the debt booked this month.
     *
     * @return array{amount: float, reservations: int}
     */
    private function outstanding(): array
    {
        $paidByReservation = $this->paidByReservation();

        $amount = 0.0;
        $count = 0;

        Reservation::query()
            ->whereNotIn('status', [ReservationStatus::Cancelled])
            ->select(['id', 'total_amount'])
            ->each(function (Reservation $reservation) use ($paidByReservation, &$amount, &$count): void {
                $paid = (float) ($paidByReservation->get($reservation->id)?->paid ?? 0);
                $due = round((float) $reservation->total_amount - $paid, 2);

                if ($due > 0) {
                    $amount += $due;
                    $count++;
                }
            });

        return [
            'amount' => round($amount, 2),
            'reservations' => $count,
        ];
    }

    /**
     * Handovers scheduled for today: the cars leaving the garage and the
     * ones coming back. Cancelled and no-show reservations are excluded —
     * neither produces a handover.
     *
     * @return array{pickups: int, returns: int}
     */
    private function today(): array
    {
        $range = [today()->startOfDay(), today()->endOfDay()];

        return [
            'pickups' => $this->handovers()
                ->whereBetween('pickup_datetime', $range)
                ->count(),
            'returns' => $this->handovers()
                ->whereBetween('expected_return_datetime', $range)
                ->count(),
        ];
    }

    /**
     * Vehicles that need the owner's eye: parked in maintenance, or already
     * past the mileage their next service is due at.
     *
     * @return array{total: int, maintenance: int, service_overdue: int}
     */
    private function fleetAttention(): array
    {
        $maintenance = Car::query()
            ->where('status', CarStatus::Maintenance)
            ->count();

        $serviceOverdue = Car::query()
            ->whereNotNull('next_service_mileage')
            ->whereColumn('current_mileage', '>=', 'next_service_mileage')
            ->count();

        return [
            'total' => $this->attentionQuery()->count(),
            'maintenance' => $maintenance,
            'service_overdue' => $serviceOverdue,
        ];
    }

    /**
     * Clients created inside the period — the counter the dashboard compares
     * against the previous window.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     */
    private function newClients(array $range): int
    {
        return Client::query()
            ->whereBetween('created_at', $range)
            ->count();
    }

    /**
     * Every calendar day in the window, oldest → newest: the x-axis shared by
     * the daily series.
     *
     * @return array<int, string>
     */
    private function dateLabels(CarbonInterface $from, CarbonInterface $to): array
    {
        $labels = [];
        $cursor = $from->copy()->startOfDay();
        $end = $to->copy()->startOfDay();

        while ($cursor->lte($end)) {
            $labels[] = $cursor->toDateString();
            $cursor->addDay();
        }

        return $labels;
    }

    /**
     * Paid money per reservation, keyed by reservation id — the "how much
     * has this booking actually collected" lookup behind every balance.
     *
     * @return Collection<int, object>
     */
    private function paidByReservation(): Collection
    {
        return Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->selectRaw('reservation_id, SUM(amount) as paid')
            ->groupBy('reservation_id')
            ->get()
            ->keyBy('reservation_id');
    }

    /**
     * The nights a hire occupies, clamped to the period: pickup day through
     * the day before return (the same unit as the pricing engine — 10 → 13
     * is three nights). Null when the hire does not touch the period.
     *
     * @return array{CarbonInterface, CarbonInterface}|null
     */
    private function occupiedNights(CarbonInterface $pickup, CarbonInterface $return, CarbonInterface $from, CarbonInterface $to): ?array
    {
        $start = $pickup->copy()->startOfDay()->max($from->copy()->startOfDay());
        $end = $return->copy()->startOfDay()->subDay()->min($to->copy()->startOfDay());

        return $end->lt($start) ? null : [$start, $end];
    }

    /**
     * Reservations that still produce a handover: a cancelled booking and a
     * no-show never hand a car over.
     */
    private function handovers(): Builder
    {
        return Reservation::query()->whereIn('status', [
            ReservationStatus::Pending,
            ReservationStatus::Confirmed,
            ReservationStatus::Reserved,
            ReservationStatus::Active,
            ReservationStatus::Completed,
        ]);
    }

    /**
     * The fleet that needs the owner's eye: parked in maintenance, or already
     * past the mileage its next service is due at.
     */
    private function attentionQuery(): Builder
    {
        return Car::query()->where(function (Builder $query): void {
            $query->where('status', CarStatus::Maintenance)
                ->orWhere(function (Builder $query): void {
                    $query->whereNotNull('next_service_mileage')
                        ->whereColumn('current_mileage', '>=', 'next_service_mileage');
                });
        });
    }

    /**
     * Net revenue explained: what came in for the period (cash basis), how it
     * split across payment methods, how it moved day by day and every money
     * movement underneath.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function netRevenueDetail(array $range): array
    {
        $paid = $this->sumPayments(PaymentRecordStatus::Paid, $range);
        $pending = $this->sumPayments(PaymentRecordStatus::Pending, $range);
        $refunded = $this->sumPayments(PaymentRecordStatus::Refunded, $range);

        $byMethod = Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereBetween('payment_date', $range)
            ->selectRaw('method, SUM(amount) as total, COUNT(*) as records_count')
            ->groupBy('method')
            ->get();

        $rows = Payment::query()
            ->with([
                'reservation:id,reservation_number,primary_client_id',
                'reservation.primaryClient:id,first_name,last_name',
            ])
            ->whereBetween('payment_date', $range)
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->get();

        return [
            'headline' => [
                'value' => round($paid - $refunded, 2),
                'paid' => $paid,
                'pending' => $pending,
                'refunded' => $refunded,
            ],
            'breakdown' => $byMethod
                ->map(fn (Payment $row): array => [
                    'key' => $row->method?->value,
                    'value' => $this->money((float) $row->total),
                    'count' => (int) $row->records_count,
                ])
                ->sortByDesc('value')
                ->values()
                ->all(),
            'trend' => $this->dailyPaymentTrend($range[0], $range[1]),
            'rows' => $rows->take(self::DETAIL_ROW_LIMIT)
                ->map(fn (Payment $payment): array => $this->paymentRow($payment))
                ->values()
                ->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * Expenses explained through the two buckets summary() adds up: bills
     * paid inside the window (by paid_date) and bills booked while still
     * pending (by created_at) — split by type, per day, with the bills
     * themselves.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function expensesDetail(array $range): array
    {
        $paid = CarExpense::query()
            ->with('car:id,registration_number')
            ->where('status', ExpenseStatus::Paid)
            ->whereBetween('paid_date', $range)
            ->get();

        $pending = CarExpense::query()
            ->with('car:id,registration_number')
            ->where('status', ExpenseStatus::Pending)
            ->whereBetween('created_at', $range)
            ->get();

        $labels = $this->dateLabels($range[0], $range[1]);
        $index = array_flip($labels);
        $paidTrend = array_fill(0, count($labels), 0.0);
        $pendingTrend = $paidTrend;

        foreach ($paid as $expense) {
            $position = $index[$expense->paid_date?->toDateString() ?? ''] ?? null;

            if ($position !== null) {
                $paidTrend[$position] += (float) $expense->amount;
            }
        }

        foreach ($pending as $expense) {
            $position = $index[$expense->created_at->toDateString()] ?? null;

            if ($position !== null) {
                $pendingTrend[$position] += (float) $expense->amount;
            }
        }

        $paidTotal = $this->money($paid->sum('amount'));
        $pendingTotal = $this->money($pending->sum('amount'));

        return [
            'headline' => [
                'value' => $this->money($paidTotal + $pendingTotal),
                'paid' => $paidTotal,
                'pending' => $pendingTotal,
                'overdue_count' => CarExpense::query()
                    ->where('status', ExpenseStatus::Pending)
                    ->whereDate('due_date', '<', today())
                    ->count(),
            ],
            'breakdown' => $paid->concat($pending)
                ->groupBy(fn (CarExpense $expense): string => $expense->type?->value ?? 'other')
                ->map(fn (Collection $group, string $key): array => [
                    'key' => $key,
                    'value' => $this->money((float) $group->sum('amount')),
                    'count' => $group->count(),
                ])
                ->sortByDesc('value')
                ->values()
                ->all(),
            'trend' => [
                'labels' => $labels,
                'paid' => array_map(fn (float $value): float => round($value, 2), $paidTrend),
                'pending' => array_map(fn (float $value): float => round($value, 2), $pendingTrend),
            ],
            'rows' => $paid->concat($pending)
                ->map(fn (CarExpense $expense): array => $this->expenseRow($expense))
                ->sortByDesc('period_date')
                ->values()
                ->take(self::DETAIL_ROW_LIMIT)
                ->all(),
            'rows_total' => $paid->count() + $pending->count(),
        ];
    }

    /**
     * Reservations picked up inside the period — the exact set summary()
     * counts — with the by-status split, the daily starting-bookings series
     * and the bookings themselves.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function reservationsDetail(array $range): array
    {
        $summary = $this->reservations($range);

        $labels = $this->dateLabels($range[0], $range[1]);
        $index = array_flip($labels);
        $daily = array_fill(0, count($labels), 0);

        $rows = Reservation::query()
            ->with(['car:id,registration_number', 'primaryClient:id,first_name,last_name'])
            ->whereBetween('pickup_datetime', $range)
            ->orderByDesc('pickup_datetime')
            ->orderByDesc('id')
            ->get();

        foreach ($rows as $reservation) {
            $position = $index[$reservation->pickup_datetime->toDateString()] ?? null;

            if ($position !== null) {
                $daily[$position]++;
            }
        }

        return [
            'headline' => [
                'value' => $summary['total'],
                'currently_active' => $summary['currently_active'],
            ],
            'breakdown' => collect($summary['by_status'])
                ->filter(fn (int $count): bool => $count > 0)
                ->map(fn (int $count, string $status): array => [
                    'key' => $status,
                    'value' => $count,
                    'count' => $count,
                ])
                ->values()
                ->all(),
            'trend' => [
                'labels' => $labels,
                'count' => $daily,
            ],
            'rows' => $rows->take(self::DETAIL_ROW_LIMIT)
                ->map(fn (Reservation $reservation): array => $this->reservationRow($reservation))
                ->values()
                ->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * Occupancy explained: the booked-versus-available split behind the rate,
     * how full the fleet was day by day and which cars sat idle.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function occupancyDetail(array $range, CarbonInterface $from, CarbonInterface $to): array
    {
        $totalCars = $this->fleet()['total_cars'];
        $occupancy = $this->occupancy($totalCars, $from, $to, $range);
        $periodDays = $this->periodDays($from, $to);

        $labels = $this->dateLabels($range[0], $range[1]);
        $index = array_flip($labels);
        $hiredByDay = array_fill(0, count($labels), []);

        $this->handovers()
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['car_id', 'pickup_datetime', 'expected_return_datetime'])
            ->each(function (Reservation $reservation) use (&$hiredByDay, $index, $from, $to): void {
                $nights = $this->occupiedNights(
                    $reservation->pickup_datetime,
                    $reservation->expected_return_datetime,
                    $from,
                    $to,
                );

                if ($nights === null) {
                    return;
                }

                for ($day = $nights[0]->copy(); $day->lte($nights[1]); $day->addDay()) {
                    $position = $index[$day->toDateString()] ?? null;

                    if ($position !== null) {
                        $hiredByDay[$position][(int) $reservation->car_id] = true;
                    }
                }
            });

        $rows = collect($this->cars($from, $to))
            ->map(fn (array $car): array => array_merge($car, [
                'available_days' => $periodDays,
                'utilization' => $periodDays > 0
                    ? round($car['booked_days'] / $periodDays, 4)
                    : 0.0,
            ]))
            ->sortByDesc('booked_days')
            ->values();

        return [
            'headline' => [
                'value' => $occupancy['rate'],
                'booked_days' => $occupancy['booked_days'],
                'available_days' => $occupancy['available_days'],
                'total_cars' => $totalCars,
            ],
            // Booked versus free nights — the two slices add up to the
            // capacity the rate divides by.
            'breakdown' => [
                ['key' => 'booked', 'value' => $occupancy['booked_days']],
                ['key' => 'free', 'value' => max(0, $occupancy['available_days'] - $occupancy['booked_days'])],
            ],
            'trend' => [
                'labels' => $labels,
                'count' => array_map(fn (array $cars): int => count($cars), $hiredByDay),
            ],
            'rows' => $rows->take(self::DETAIL_ROW_LIMIT)->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * The debt book: every reservation still owing money, what it has already
     * collected and what is left, most overdue first — plus the split by
     * booking status. A stock, so it ignores the period on purpose.
     *
     * @return array<string, mixed>
     */
    private function outstandingDetail(): array
    {
        $paidByReservation = $this->paidByReservation();

        $rows = Reservation::query()
            ->with(['car:id,registration_number', 'primaryClient:id,first_name,last_name'])
            ->whereNotIn('status', [ReservationStatus::Cancelled])
            ->get()
            ->map(function (Reservation $reservation) use ($paidByReservation): ?array {
                $paid = round((float) ($paidByReservation->get($reservation->id)?->paid ?? 0), 2);
                $due = round((float) $reservation->total_amount - $paid, 2);

                if ($due <= 0) {
                    return null;
                }

                return array_merge($this->reservationRow($reservation), [
                    'paid_amount' => $paid,
                    'due_amount' => $due,
                ]);
            })
            ->filter()
            ->sortByDesc('due_amount')
            ->values();

        return [
            'headline' => [
                'value' => $this->money($rows->sum('due_amount')),
                'reservations' => $rows->count(),
            ],
            'breakdown' => $rows->groupBy(fn (array $row): string => (string) $row['status'])
                ->map(fn (Collection $group, string $status): array => [
                    'key' => $status,
                    'value' => $this->money((float) $group->sum('due_amount')),
                    'count' => $group->count(),
                ])
                ->sortByDesc('value')
                ->values()
                ->all(),
            'rows' => $rows->take(self::DETAIL_ROW_LIMIT)->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * The day's handovers: which cars leave the garage and which come back,
     * in schedule order.
     *
     * @return array<string, mixed>
     */
    private function todayDetail(): array
    {
        $today = [today()->startOfDay(), today()->endOfDay()];

        $pickups = $this->handovers()
            ->with(['car:id,registration_number', 'primaryClient:id,first_name,last_name'])
            ->whereBetween('pickup_datetime', $today)
            ->orderBy('pickup_datetime')
            ->orderBy('id')
            ->get();

        $returns = $this->handovers()
            ->with(['car:id,registration_number', 'primaryClient:id,first_name,last_name'])
            ->whereBetween('expected_return_datetime', $today)
            ->orderBy('expected_return_datetime')
            ->orderBy('id')
            ->get();

        $rows = $pickups
            ->map(fn (Reservation $reservation): array => array_merge(
                $this->reservationRow($reservation),
                ['kind' => 'pickup'],
            ))
            ->concat($returns->map(fn (Reservation $reservation): array => array_merge(
                $this->reservationRow($reservation),
                ['kind' => 'return'],
            )))
            ->values();

        return [
            'headline' => [
                'value' => $pickups->count() + $returns->count(),
                'pickups' => $pickups->count(),
                'returns' => $returns->count(),
            ],
            'breakdown' => [
                ['key' => 'pickups', 'value' => $pickups->count(), 'count' => $pickups->count()],
                ['key' => 'returns', 'value' => $returns->count(), 'count' => $returns->count()],
            ],
            'rows' => $rows->take(self::DETAIL_ROW_LIMIT)->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * The fleet that needs the owner's eye, most urgent first: anything
     * parked in maintenance, then anything furthest past its service mileage.
     *
     * @return array<string, mixed>
     */
    private function fleetAttentionDetail(): array
    {
        $summary = $this->fleetAttention();

        $rows = $this->attentionQuery()
            ->with(['brand:id,name', 'model:id,name'])
            ->get()
            ->map(function (Car $car): array {
                $inMaintenance = $car->status === CarStatus::Maintenance;
                $serviceOverdue = $car->next_service_mileage !== null
                    && $car->current_mileage >= $car->next_service_mileage;

                return [
                    'car_id' => $car->id,
                    'registration_number' => $car->registration_number,
                    'brand' => $car->brand?->name,
                    'model' => $car->model?->name,
                    'year' => $car->year,
                    'daily_price' => (float) $car->daily_price,
                    'status' => $car->status?->value,
                    'in_maintenance' => $inMaintenance,
                    'service_overdue' => $serviceOverdue,
                    'current_mileage' => $car->current_mileage,
                    'next_service_mileage' => $car->next_service_mileage,
                    'service_gap' => $serviceOverdue
                        ? $car->current_mileage - $car->next_service_mileage
                        : 0,
                    'last_maintenance_at' => $car->last_maintenance_at?->toDateString(),
                ];
            })
            ->sort(function (array $left, array $right): int {
                return ($right['in_maintenance'] <=> $left['in_maintenance'])
                    ?: ($right['service_gap'] <=> $left['service_gap']);
            })
            ->values();

        return [
            'headline' => [
                'value' => $summary['total'],
                'maintenance' => $summary['maintenance'],
                'service_overdue' => $summary['service_overdue'],
            ],
            'breakdown' => [
                ['key' => 'maintenance', 'value' => $summary['maintenance'], 'count' => $summary['maintenance']],
                ['key' => 'service_overdue', 'value' => $summary['service_overdue'], 'count' => $summary['service_overdue']],
            ],
            'rows' => $rows->all(),
            'rows_total' => $rows->count(),
        ];
    }

    /**
     * Clients won during the period: the daily signup curve, where they came
     * from and who they are.
     *
     * @param  array{CarbonInterface, CarbonInterface}  $range
     * @return array<string, mixed>
     */
    private function newClientsDetail(array $range): array
    {
        $labels = $this->dateLabels($range[0], $range[1]);
        $index = array_flip($labels);
        $daily = array_fill(0, count($labels), 0);

        $clients = Client::query()
            ->withCount('reservations')
            ->whereBetween('created_at', $range)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get();

        foreach ($clients as $client) {
            $position = $index[$client->created_at->toDateString()] ?? null;

            if ($position !== null) {
                $daily[$position]++;
            }
        }

        return [
            'headline' => [
                'value' => $clients->count(),
            ],
            'breakdown' => $clients
                ->groupBy(fn (Client $client): string => $client->source?->value ?? 'other')
                ->map(fn (Collection $group, string $source): array => [
                    'key' => $source,
                    'value' => $group->count(),
                    'count' => $group->count(),
                ])
                ->sortByDesc('value')
                ->values()
                ->all(),
            'trend' => [
                'labels' => $labels,
                'count' => $daily,
            ],
            'rows' => $clients->take(self::DETAIL_ROW_LIMIT)
                ->map(fn (Client $client): array => [
                    'id' => $client->id,
                    'full_name' => $client->full_name,
                    'phone' => $client->phone,
                    'email' => $client->email,
                    'city' => $client->city,
                    'source' => $client->source?->value,
                    'status' => $client->status?->value,
                    'is_active' => $client->is_active,
                    'reservations_count' => (int) $client->reservations_count,
                    'created_at' => $client->created_at?->toIso8601String(),
                ])
                ->values()
                ->all(),
            'rows_total' => $clients->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function paymentRow(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'payment_date' => $payment->payment_date->toIso8601String(),
            'amount' => (float) $payment->amount,
            'method' => $payment->method?->value,
            'status' => $payment->status->value,
            'reservation_number' => $payment->reservation?->reservation_number,
            'client' => $payment->reservation?->primaryClient?->full_name,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function expenseRow(CarExpense $expense): array
    {
        return [
            'id' => $expense->id,
            'title' => $expense->title,
            'type' => $expense->type?->value,
            'status' => $expense->status?->value,
            'amount' => (float) $expense->amount,
            'due_date' => $expense->due_date?->toDateString(),
            'paid_date' => $expense->paid_date?->toDateString(),
            // The date that lands the bill inside the period.
            'period_date' => ($expense->status === ExpenseStatus::Paid
                ? $expense->paid_date
                : $expense->created_at)?->toDateString(),
            'car' => $expense->car?->registration_number,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function reservationRow(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'reservation_number' => $reservation->reservation_number,
            'status' => $reservation->status?->value,
            'payment_status' => $reservation->payment_status?->value,
            'pickup_datetime' => $reservation->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $reservation->expected_return_datetime?->toIso8601String(),
            'total_amount' => (float) $reservation->total_amount,
            'car' => $reservation->car?->registration_number,
            'client' => $reservation->primaryClient?->full_name,
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
     * @param  array{CarbonInterface, CarbonInterface}  $range
     */
    private function countPayments(PaymentRecordStatus $status, array $range): int
    {
        return Payment::query()
            ->where('status', $status)
            ->whereBetween('payment_date', $range)
            ->count();
    }

    /**
     * Per-day totals by status across the range, zero-filled so the chart
     * gets one continuous series. Grouping happens in PHP so MySQL and the
     * SQLite test runner stay in lockstep.
     *
     * @return array{labels: array<int, string>, paid: array<int, float>, pending: array<int, float>, refunded: array<int, float>}
     */
    private function dailyPaymentTrend(CarbonInterface $from, CarbonInterface $to): array
    {
        $labels = $this->dateLabels($from, $to);
        $index = array_flip($labels);
        $series = [
            'paid' => array_fill(0, count($labels), 0.0),
            'pending' => array_fill(0, count($labels), 0.0),
            'refunded' => array_fill(0, count($labels), 0.0),
        ];

        foreach (Payment::query()
            ->whereBetween('payment_date', [$from->copy()->startOfDay(), $to->copy()->endOfDay()])
            ->get(['payment_date', 'amount', 'status']) as $payment) {
            $day = $payment->payment_date->format('Y-m-d');

            if (! isset($index[$day])) {
                continue;
            }

            $series[$payment->status->value][$index[$day]] += (float) $payment->amount;
        }

        return [
            'labels' => $labels,
            'paid' => array_map(fn (float $value) => round($value, 2), $series['paid']),
            'pending' => array_map(fn (float $value) => round($value, 2), $series['pending']),
            'refunded' => array_map(fn (float $value) => round($value, 2), $series['refunded']),
        ];
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
                ReservationStatus::Reserved,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->where('pickup_datetime', '<', $range[1])
            ->where('expected_return_datetime', '>', $range[0])
            ->get(['car_id', 'pickup_datetime', 'expected_return_datetime']);

        foreach ($reservations as $reservation) {
            $nights = $this->occupiedNights(
                $reservation->pickup_datetime,
                $reservation->expected_return_datetime,
                $from,
                $to,
            );

            if ($nights === null) {
                continue;
            }

            $days[$reservation->car_id] = ($days[$reservation->car_id] ?? 0)
                + $nights[0]->diffInDays($nights[1]) + 1;
        }

        return collect($days);
    }
}
