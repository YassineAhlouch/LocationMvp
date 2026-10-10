<?php

namespace App\Services\Cars;

use App\Enums\InstallmentStatus;
use App\Models\Car;
use App\Models\CarFinancing;
use App\Models\CarInstallment;
use App\Models\User;
use App\Services\Activity\LogsActivity;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Write side of car financing: creating the financing (which materialises its
 * installment schedule), editing it, settling an installment and removing it.
 * Every operation is audited through the shared ActivityLogger.
 */
final class CarFinancingService
{
    use LogsActivity;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(Car $car, array $data, User $actor): CarFinancing
    {
        return DB::transaction(function () use ($car, $data, $actor): CarFinancing {
            $financing = $car->financing()->create($this->normalize($data));
            $financing->load('installments');

            $this->logActivity('financing', 'created', $financing, $actor, 'Car financing created', null, $this->snapshot($financing));

            return $financing;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(CarFinancing $financing, array $data, User $actor): CarFinancing
    {
        $old = $this->snapshot($financing);

        $financing->fill($this->normalize($data, $financing));

        $scheduleChanged = $financing->isDirty([
            'financed_amount',
            'installment_amount',
            'installments_count',
            'first_due_date',
        ]);

        $financing->save();

        // Only rebuild the schedule while nothing has been settled — paid rows
        // are committed money and must never be silently rewritten.
        if ($scheduleChanged && ! $financing->installments()->where('status', InstallmentStatus::Paid)->exists()) {
            $financing->installments()->delete();
            $financing->generateInstallments();
        }

        $financing->load('installments');

        $this->logActivity('financing', 'updated', $financing, $actor, 'Car financing updated', $old, $this->snapshot($financing));

        return $financing;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function markPaid(CarInstallment $installment, array $data, User $actor): CarInstallment
    {
        $old = $installment->only(['status', 'paid_date', 'reference']);

        $installment->markPaid(
            isset($data['paid_date']) ? Carbon::parse($data['paid_date']) : null,
            $data['reference'] ?? null,
        );

        $this->logActivity(
            'financing',
            'installment_paid',
            $installment,
            $actor,
            'Car installment paid',
            $old,
            $installment->only(['status', 'paid_date', 'reference']),
        );

        return $installment;
    }

    public function delete(CarFinancing $financing, User $actor): void
    {
        $old = $this->snapshot($financing);

        $financing->delete();

        $this->logActivity('financing', 'deleted', $financing, $actor, 'Car financing deleted', $old);
    }

    /**
     * Derive the financed amount from price − down payment when the caller
     * leaves it out; otherwise trust the explicit value.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalize(array $data, ?CarFinancing $existing = null): array
    {
        $purchasePrice = (float) ($data['purchase_price'] ?? $existing?->purchase_price ?? 0);
        $downPayment = (float) ($data['down_payment'] ?? $existing?->down_payment ?? 0);

        if (! array_key_exists('financed_amount', $data) || $data['financed_amount'] === null) {
            $data['financed_amount'] = max(0, $purchasePrice - $downPayment);
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function snapshot(CarFinancing $financing): array
    {
        return collect($financing->toArray())
            ->except(['created_at', 'updated_at'])
            ->all();
    }
}
