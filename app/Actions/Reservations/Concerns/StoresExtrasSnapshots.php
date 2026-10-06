<?php

namespace App\Actions\Reservations\Concerns;

use App\Enums\PricingType;
use App\Models\Extra;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Services\Pricing\PricingService;

/**
 * Resolves catalog extras into immutable booking-time snapshots.
 * Snapshot rows carry no FK to the catalog by design — price changes in
 * the catalog must never rewrite history on existing reservations.
 */
trait StoresExtrasSnapshots
{
    /**
     * Resolved lines carry both the catalog model (for snapshotting) and the
     * pricing inputs (for PricingService::extrasTotal), so quote and snapshot
     * consume the exact same array.
     *
     * @param  array<int, array{extra_id: int, quantity?: int}>  $input
     * @return array<int, array{extra: Extra, quantity: int, pricing_type: string|int, unit_price: float|int}>
     */
    private function resolveExtras(array $input): array
    {
        $resolved = [];

        foreach ($input as $line) {
            $extra = Extra::query()->whereKey($line['extra_id'])->firstOrFail();

            $resolved[] = [
                'extra' => $extra,
                'quantity' => max(1, (int) ($line['quantity'] ?? 1)),
                'pricing_type' => $extra->pricing_type instanceof PricingType
                    ? $extra->pricing_type->value
                    : $extra->pricing_type,
                'unit_price' => $extra->default_price,
            ];
        }

        return $resolved;
    }

    /**
     * @param  array<int, array{extra: Extra, quantity: int}>  $extras
     */
    private function snapshotExtras(Reservation $reservation, array $extras, int $rentalDays, PricingService $pricing): void
    {
        foreach ($extras as $line) {
            /** @var Extra $extra */
            $extra = $line['extra'];

            ReservationExtra::create([
                'reservation_id' => $reservation->id,
                'name' => $extra->name,
                'description' => $extra->description,
                'pricing_type' => $extra->pricing_type instanceof PricingType
                    ? $extra->pricing_type->value
                    : $extra->pricing_type,
                'quantity' => $line['quantity'],
                'unit_price' => $extra->default_price,
                'total_price' => round(
                    $pricing->lineTotal($extra->pricing_type, $extra->default_price, $line['quantity'], $rentalDays),
                    2,
                ),
            ]);
        }
    }
}
