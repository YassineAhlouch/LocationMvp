<?php

namespace App\Console\Commands;

use App\Enums\InstallmentStatus;
use App\Models\CarInstallment;
use Illuminate\Console\Command;

/**
 * Flip unpaid installments whose due date has passed to 'overdue'. Runs
 * agency-agnostically: the state of a schedule is a property of the plan, not
 * of who is looking at it. 'overdue' is also derived on read, so a missed run
 * never hides a late installment from the UI.
 */
class MarkOverdueInstallments extends Command
{
    protected $signature = 'installments:mark-overdue';

    protected $description = 'Flag unpaid car-financing installments past their due date as overdue';

    public function handle(): int
    {
        $updated = CarInstallment::query()
            ->where('status', InstallmentStatus::Pending)
            ->whereDate('due_date', '<', today())
            ->update([
                'status' => InstallmentStatus::Overdue->value,
                'updated_at' => now(),
            ]);

        $this->info("Marked {$updated} installment(s) as overdue.");

        return self::SUCCESS;
    }
}
