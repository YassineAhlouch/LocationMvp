<?php

namespace App\Actions\Reservations\Concerns;

use App\Enums\PricingType;
use App\Models\Extra;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Services\Pricing\PricingService;

/**
 * Resolves extras into immutable booking-time snapshots.
 * Snapshot rows carry no FK to the catalog by design — price changes in
 * the catalog must never rewrite history on existing reservations.
 *
 * Lines may reference a catalog extra (`extra_id`) or be typed free-form
 * on the booking form (`name`, `pricing_type`, `unit_price`); both resolve
 * to the same snapshot shape.
 */
trait StoresExtrasSnapshots
{
    /**
     * Resolved lines carry the snapshot fields (name, description, pricing
     * type and unit price) plus the pricing inputs (quantity, pricing_type,
     * unit_price), so quote and snapshot consume the exact same array.
     *
     * @param  array<int, array{
     *     extra_id?: int|string,
     *     name?: string,
     *     description?: string|null,
     *     pricing_type?: string|int,
     *     unit_price?: int|float|string,
     *     quantity?: int,
     * }>  $input
     * @return array<int, array{
     *     name: string,
     *     description: string|null,
     *     quantity: int,
     *     pricing_type: string,
     *     unit_price: float,
     * }>
     */
    private function resolveExtras(array $input): array
    {
        $resolved = [];

        foreach ($input as $line) {
            $quantity = max(1, (int) ($line['quantity'] ?? 1));

            if (! empty($line['extra_id'])) {
                /** @var Extra $extra */
                $extra = Extra::query()->whereKey($line['extra_id'])->firstOrFail();

                $resolved[] = [
                    'name' => $extra->name,
                    'description' => $extra->description,
                    'quantity' => $quantity,
                    'pricing_type' => $extra->pricing_type instanceof PricingType
                        ? $extra->pricing_type->value
                        : (string) $extra->pricing_type,
                    'unit_price' => (float) $extra->default_price,
                ];

                continue;
            }

            $resolved[] = [
                'name' => (string) $line['name'],
                'description' => $line['description'] ?? null,
                'quantity' => $quantity,
                'pricing_type' => (string) $line['pricing_type'],
                'unit_price' => (float) $line['unit_price'],
            ];
        }

        return $resolved;
    }

    /**
     * @param  array<int, array{
     *     name: string,
     *     description: string|null,
     *     quantity: int,
     *     pricing_type: string,
     *     unit_price: float,
     * }>  $extras
     */
    private function snapshotExtras(Reservation $reservation, array $extras, int $rentalDays, PricingService $pricing): void
    {
        foreach ($extras as $line) {
            ReservationExtra::create([
                'reservation_id' => $reservation->id,
                'name' => $line['name'],
                'description' => $line['description'],
                'pricing_type' => $line['pricing_type'],
                'quantity' => $line['quantity'],
                'unit_price' => $line['unit_price'],
                'total_price' => round(
                    $pricing->lineTotal($line['pricing_type'], $line['unit_price'], $line['quantity'], $rentalDays),
                    2,
                ),
            ]);
        }
    }
}
