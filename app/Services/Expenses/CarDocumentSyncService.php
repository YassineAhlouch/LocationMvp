<?php

namespace App\Services\Expenses;

use App\Enums\ExpenseType;
use App\Models\Car;
use App\Models\CarExpense;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Carbon;

/**
 * The bridge between the expense ledger and the car's document dates:
 * recording a renewal as an expense updates the car it bills.
 *
 *   insurance  → the due date becomes the policy's expiry date, the vendor
 *                (when named) becomes the insurer;
 *   inspection → the due date becomes the next technical-inspection date.
 *
 * A forward renewal (the new expiry is later than the date the alerts were
 * raised for) also resolves the car's pending document alerts, so the inbox
 * reflects the fix without anyone hunting down stale rows.
 */
class CarDocumentSyncService
{
    public function sync(CarExpense $expense): void
    {
        if (! in_array($expense->type, [ExpenseType::Insurance, ExpenseType::Inspection], true)) {
            return;
        }

        $car = $expense->car()->withTrashed()->first();

        if (! $car instanceof Car) {
            return;
        }

        $attributes = [];

        if ($expense->type === ExpenseType::Insurance) {
            if ($expense->due_date !== null) {
                $attributes['insurance_expiry_date'] = $expense->due_date;
            }

            if (filled($expense->vendor)) {
                $attributes['insurance_company'] = $expense->vendor;
            }
        }

        if ($expense->type === ExpenseType::Inspection && $expense->due_date !== null) {
            $attributes['technical_inspection_expiry'] = $expense->due_date;
        }

        if ($attributes === []) {
            return;
        }

        $column = $expense->type === ExpenseType::Insurance
            ? 'insurance_expiry_date'
            : 'technical_inspection_expiry';

        $previous = $car->{$column};

        $car->update($attributes);

        $this->resolveAlerts($car, $expense->type, $column, $previous);
    }

    private function resolveAlerts(Car $car, ExpenseType $type, string $column, ?Carbon $previous): void
    {
        $notificationType = $type === ExpenseType::Insurance ? 'car_insurance' : 'car_inspection';

        if ($previous === null || $car->{$column}->lessThanOrEqualTo($previous)) {
            return;
        }

        DatabaseNotification::query()
            ->where('type', $notificationType)
            ->where('data->car_id', $car->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
