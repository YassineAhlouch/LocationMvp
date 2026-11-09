<?php

namespace App\Services\Cars;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Enums\InstallmentStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\CarFinancing;
use App\Models\CarInstallment;
use App\Models\Payment;
use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Read-only profitability analytics for one car, combining reservations,
 * expenses and its financing schedule.
 *
 * Money conventions (shared with ReportingService):
 *  - revenue is cash-basis: paid payment records on the car's reservations;
 *  - expenses are paid car_expenses;
 *  - installments_paid is the sum of settled financing rows;
 *  - the service window starts at the financing purchase date (or the car's
 *    creation) and runs to today, so per-day ratios have a real denominator.
 *    When the caller passes a from/to window every flow above is scoped to it
 *    instead; only the payback comparison stays lifetime.
 *
 * All queries ride the agency global scope where the model has one, and are
 * always driven from the agency-scoped car, so nothing leaks across tenants.
 */
final class CarStatisticsService
{
    /**
     * @return array<string, mixed>
     */
    public function statistics(
        Car $car,
        int $months = 12,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): array {
        $ranged = $from !== null && $to !== null;

        $financing = $car->financing()->with('installments')->first();

        $serviceStart = $this->serviceStart($car, $financing);
        $today = today()->startOfDay();

        // Without a window the analytics cover the vehicle's whole life (the
        // financing purchase date onward). With one, every flow is scoped to
        // it: revenue by payment date (falling back to creation), expenses by
        // paid date, then due date, then creation and settled installments by
        // paid date. The payback comparison (revenue vs. purchase price) stays
        // lifetime — a window cannot "pay back" the car.
        $windowStart = $ranged ? $from : $serviceStart;
        $windowEnd = $ranged ? $to : $today;
        $daysInService = $ranged
            ? max(1, (int) $windowStart->diffInDays($windowEnd) + 1)
            : max(1, (int) abs($serviceStart->diffInDays($today)));

        $revenue = $this->money($this->revenue($car, $from, $to));
        $expenses = $this->money($this->expenses($car, $from, $to));
        $installmentsPaid = $this->money($this->installmentsPaid($car, $from, $to));
        $downPayment = $ranged
            ? (($financing?->purchase_date !== null
                && $financing->purchase_date->between($from, $to))
                ? $this->money((float) ($financing?->down_payment ?? 0))
                : 0.0)
            : $this->money((float) ($financing?->down_payment ?? 0));
        $revenueLifetime = $ranged ? $this->money($this->revenue($car)) : $revenue;

        $purchasePrice = $this->money((float) ($financing?->purchase_price ?? $car->purchase_price ?? 0));

        $operatingProfit = $this->money($revenue - $expenses);
        $netCashPosition = $this->money($revenue - $expenses - $downPayment - $installmentsPaid);
        $profitPerDay = $this->money($operatingProfit / $daysInService);

        $rentedDays = $this->rentedDays($car, $windowStart, $windowEnd);
        $utilizationRate = $daysInService > 0 ? round(min(1, $rentedDays / $daysInService), 4) : 0.0;
        $paybackPercent = $purchasePrice > 0 ? round($revenueLifetime / $purchasePrice * 100, 2) : 0.0;

        return [
            'period' => [
                'months' => $months,
                'from' => $windowStart->toDateString(),
                'to' => $windowEnd->toDateString(),
            ],
            'kpis' => [
                'total_revenue' => $revenue,
                'total_expenses' => $expenses,
                'installments_paid' => $installmentsPaid,
                'down_payment' => $downPayment,
                'purchase_price' => $purchasePrice,
                'operating_profit' => $operatingProfit,
                'net_cash_position' => $netCashPosition,
                'days_in_service' => $daysInService,
                'profit_per_day' => $profitPerDay,
                'utilization_rate' => $utilizationRate,
                'payback_percent' => $paybackPercent,
                'is_profitable' => $operatingProfit > 0,
                'is_paid_off' => $purchasePrice > 0 && $revenueLifetime >= $purchasePrice,
                'remaining_to_payback' => $this->money(max(0, $purchasePrice - $revenueLifetime)),
            ],
            'financing_progress' => $this->financingProgress($financing, $paybackPercent),
            'monthly_series' => $this->monthlySeries($car, $months, $from, $to),
            'utilization' => $this->utilization($car, $windowStart, $windowEnd, $daysInService, $rentedDays, $utilizationRate),
            'expenses_by_type' => $this->expensesByType($car, $from, $to),
        ];
    }

    private function serviceStart(Car $car, ?CarFinancing $financing): CarbonInterface
    {
        return $financing?->purchase_date?->copy()->startOfDay()
            ?? $car->created_at?->copy()->startOfDay()
            ?? today()->startOfDay();
    }

    private function revenue(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): float {
        return (float) Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereHas('reservation', fn ($query) => $query->where('car_id', $car->id))
            ->when($from !== null && $to !== null, fn ($query) => $query->whereRaw(
                'COALESCE(payment_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
            ->sum('amount');
    }

    private function expenses(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): float {
        return (float) CarExpense::query()
            ->where('car_id', $car->id)
            ->where('status', ExpenseStatus::Paid)
            ->when($from !== null && $to !== null, fn ($query) => $query->whereRaw(
                'COALESCE(paid_date, due_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
            ->sum('amount');
    }

    private function installmentsPaid(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): float {
        // Settled rows count their real paid_amount; COALESCE keeps any legacy
        // paid row (settled before paid_amount existed) valued at its schedule.
        return (float) CarInstallment::query()
            ->where('car_id', $car->id)
            ->where('status', InstallmentStatus::Paid)
            ->when($from !== null && $to !== null, fn ($query) => $query->whereNotNull('paid_date')
                ->whereBetween('paid_date', [$from->toDateString(), $to->toDateString()]))
            ->selectRaw('SUM(COALESCE(paid_amount, amount)) as total')
            ->value('total');
    }

    /**
     * @return array<string, mixed>
     */
    private function financingProgress(?CarFinancing $financing, float $paybackPercent): array
    {
        if ($financing === null) {
            return [
                'has_financing' => false,
                'purchase_date' => null,
                'purchase_price' => 0.0,
                'down_payment' => 0.0,
                'financed_amount' => 0.0,
                'installment_amount' => 0.0,
                'installments_count' => 0,
                'installments_paid_count' => 0,
                'installments_paid_amount' => 0.0,
                'installments_remaining_amount' => 0.0,
                'progress_percent' => 0.0,
                'payback_percent' => $paybackPercent,
                'lender' => null,
                'next_installment' => null,
            ];
        }

        $installments = $financing->installments;
        $paid = $installments->filter(fn (CarInstallment $installment) => $installment->status->isPaid());
        $paidAmount = $this->money((float) $paid->sum(
            fn (CarInstallment $installment) => (float) ($installment->paid_amount ?? $installment->amount),
        ));
        $financed = $this->money((float) $financing->financed_amount);
        $count = (int) $financing->installments_count;
        $paidCount = $paid->count();

        $next = $installments->first(fn (CarInstallment $installment) => ! $installment->status->isPaid());

        return [
            'has_financing' => true,
            'purchase_date' => $financing->purchase_date?->toDateString(),
            'purchase_price' => $this->money((float) $financing->purchase_price),
            'down_payment' => $this->money((float) $financing->down_payment),
            'financed_amount' => $financed,
            'installment_amount' => $this->money((float) $financing->installment_amount),
            'installments_count' => $count,
            'installments_paid_count' => $paidCount,
            'installments_paid_amount' => $paidAmount,
            'installments_remaining_amount' => $this->money(max(0, $financed - $paidAmount)),
            'progress_percent' => $count > 0 ? round($paidCount / $count * 100, 2) : 0.0,
            'payback_percent' => $paybackPercent,
            'lender' => $financing->lender,
            'next_installment' => $next === null ? null : [
                'id' => $next->id,
                'installment_number' => $next->installment_number,
                'due_date' => $next->due_date?->toDateString(),
                'amount' => $this->money((float) $next->amount),
                'status' => $next->isOverdue() ? InstallmentStatus::Overdue->value : $next->status->value,
            ],
        ];
    }

    /**
     * Zero-filled monthly series (oldest → newest): paid revenue, paid
     * expenses and settled installments as bars, net cash as the line. With a
     * window the months cover it (capped at 24); without, the last $months.
     *
     * @return array<int, array<string, mixed>>
     */
    private function monthlySeries(
        Car $car,
        int $months,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): array {
        $ranged = $from !== null && $to !== null;
        $months = $ranged
            ? (int) min(
                24,
                max(1, (int) $from->startOfMonth()->diffInMonths($to->startOfMonth()) + 1),
            )
            : max(1, min(24, $months));
        $start = $ranged
            ? $from->startOfMonth()
            : today()->startOfMonth()->subMonths($months - 1);
        $end = $ranged ? $to->endOfDay() : null;

        $index = [];
        $series = [];

        for ($i = 0; $i < $months; $i++) {
            $label = $start->copy()->addMonths($i)->format('Y-m');
            $index[$label] = $i;
            $series[$i] = ['month' => $label, 'revenue' => 0.0, 'expenses' => 0.0, 'installments' => 0.0];
        }

        foreach (Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->whereHas('reservation', fn ($query) => $query->where('car_id', $car->id))
            ->whereNotNull('payment_date')
            ->where('payment_date', '>=', $start)
            ->when($ranged, fn ($query) => $query->where('payment_date', '<=', $end))
            ->get(['payment_date', 'amount']) as $payment) {
            $label = $payment->payment_date->format('Y-m');

            if (isset($index[$label])) {
                $series[$index[$label]]['revenue'] += (float) $payment->amount;
            }
        }

        foreach (CarExpense::query()
            ->where('car_id', $car->id)
            ->where('status', ExpenseStatus::Paid)
            ->whereNotNull('paid_date')
            ->where('paid_date', '>=', $start->toDateString())
            ->when($ranged, fn ($query) => $query->where('paid_date', '<=', $end->toDateString()))
            ->get(['paid_date', 'amount']) as $expense) {
            $label = $expense->paid_date->format('Y-m');

            if (isset($index[$label])) {
                $series[$index[$label]]['expenses'] += (float) $expense->amount;
            }
        }

        foreach (CarInstallment::query()
            ->where('car_id', $car->id)
            ->where('status', InstallmentStatus::Paid)
            ->whereNotNull('paid_date')
            ->where('paid_date', '>=', $start->toDateString())
            ->when($ranged, fn ($query) => $query->where('paid_date', '<=', $end->toDateString()))
            ->get(['paid_date', 'amount', 'paid_amount']) as $installment) {
            $label = $installment->paid_date->format('Y-m');

            if (isset($index[$label])) {
                $series[$index[$label]]['installments'] += (float) ($installment->paid_amount ?? $installment->amount);
            }
        }

        return array_map(function (array $row): array {
            $revenue = $this->money((float) $row['revenue']);
            $expenses = $this->money((float) $row['expenses']);
            $installments = $this->money((float) $row['installments']);

            return [
                'month' => $row['month'],
                'revenue' => $revenue,
                'expenses' => $expenses,
                'installments' => $installments,
                'net' => $this->money($revenue - $expenses - $installments),
            ];
        }, $series);
    }

    /**
     * @return array<string, mixed>
     */
    private function utilization(
        Car $car,
        CarbonInterface $start,
        CarbonInterface $today,
        int $daysInService,
        int $rentedDays,
        float $rate,
    ): array {
        $maintenanceDays = $this->maintenanceDays($car, $start, $today);
        $idleDays = max(0, $daysInService - $rentedDays - $maintenanceDays);

        return [
            'days_in_service' => $daysInService,
            'available_days' => $daysInService,
            'rented_days' => $rentedDays,
            'maintenance_days' => $maintenanceDays,
            'idle_days' => $idleDays,
            'rate' => $rate,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function expensesByType(
        Car $car,
        ?CarbonImmutable $from = null,
        ?CarbonImmutable $to = null,
    ): array {
        return CarExpense::query()
            ->where('car_id', $car->id)
            ->when($from !== null && $to !== null, fn ($query) => $query->whereRaw(
                'COALESCE(paid_date, due_date, created_at) BETWEEN ? AND ?',
                [$from->toDateTimeString(), $to->toDateTimeString()],
            ))
            ->get(['type', 'amount', 'status'])
            ->groupBy(fn (CarExpense $expense) => $expense->type->value)
            ->map(fn (Collection $group, string $type) => [
                'type' => $type,
                'amount' => $this->money((float) $group->sum('amount')),
                'paid' => $this->money((float) $group
                    ->where('status', ExpenseStatus::Paid)
                    ->sum('amount')),
                'count' => $group->count(),
            ])
            ->sortByDesc('amount')
            ->values()
            ->all();
    }

    /**
     * Nights the car was on hire within the service window, using the same
     * pickup → day-before-return convention as ReportingService.
     */
    private function rentedDays(Car $car, CarbonInterface $start, CarbonInterface $today): int
    {
        $reservations = Reservation::query()
            ->where('car_id', $car->id)
            ->whereIn('status', [
                ReservationStatus::Pending,
                ReservationStatus::Confirmed,
                ReservationStatus::Reserved,
                ReservationStatus::Active,
                ReservationStatus::Completed,
            ])
            ->get(['pickup_datetime', 'expected_return_datetime']);

        $days = 0;
        $windowStart = $start->copy()->startOfDay();
        $windowEnd = $today->copy()->startOfDay();

        foreach ($reservations as $reservation) {
            $occupiedStart = $reservation->pickup_datetime->copy()->startOfDay();
            $occupiedEnd = $reservation->expected_return_datetime->copy()->startOfDay()->subDay();

            $overlapStart = $occupiedStart->max($windowStart);
            $overlapEnd = $occupiedEnd->min($windowEnd);

            if ($overlapEnd->lt($overlapStart)) {
                continue;
            }

            $days += (int) abs($overlapStart->diffInDays($overlapEnd)) + 1;
        }

        return $days;
    }

    /**
     * Distinct calendar days covered by maintenance expense spans, clamped to
     * the service window.
     */
    private function maintenanceDays(Car $car, CarbonInterface $start, CarbonInterface $today): int
    {
        $expenses = CarExpense::query()
            ->where('car_id', $car->id)
            ->where('type', ExpenseType::Maintenance)
            ->get(['start_date', 'due_date', 'paid_date']);

        $days = [];

        foreach ($expenses as $expense) {
            $from = ($expense->start_date ?? $expense->paid_date ?? $expense->due_date)?->copy()->startOfDay();
            $to = ($expense->paid_date ?? $expense->due_date ?? $expense->start_date)?->copy()->startOfDay();

            if ($from === null || $to === null) {
                continue;
            }

            if ($to->lt($from)) {
                [$from, $to] = [$to, $from];
            }

            $clampedFrom = $from->max($start);
            $clampedTo = $to->min($today);

            if ($clampedTo->lt($clampedFrom)) {
                continue;
            }

            for ($cursor = $clampedFrom->copy(); $cursor->lte($clampedTo); $cursor->addDay()) {
                $days[$cursor->toDateString()] = true;
            }
        }

        return count($days);
    }

    private function money(float $value): float
    {
        return round($value, 2);
    }
}
