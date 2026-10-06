<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PricingType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pricing\QuotePricingRequest;
use App\Models\Car;
use App\Models\Extra;
use App\Services\Pricing\PricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class PricingController extends Controller
{
    /**
     * Dry-run calculator for the booking form: the exact engine used by
     * create/update/extend/late-complete, including the per-day rule
     * breakdown, but nothing is persisted. Availability stays on its own
     * endpoint — this one answers "what does it cost?", not "is it free?".
     */
    public function quote(QuotePricingRequest $request, PricingService $pricing): JsonResponse
    {
        $validated = $request->validated();
        $car = Car::query()->findOrFail($validated['car_id']);

        $pickup = Carbon::parse($validated['pickup_datetime']);
        $return = Carbon::parse($validated['expected_return_datetime']);
        $dailyRate = isset($validated['daily_rate'])
            ? (float) $validated['daily_rate']
            : (float) $car->daily_price;

        $quote = $pricing->quote(
            $pickup,
            $return,
            $dailyRate,
            $this->extrasLines($validated['extras'] ?? []),
            (float) ($validated['discount_amount'] ?? 0),
            (int) $car->agency_id,
        );

        return response()->json(array_merge([
            'car_id' => (int) $car->id,
            'pickup_datetime' => $pickup->toIso8601String(),
            'expected_return_datetime' => $return->toIso8601String(),
            'base_daily_price' => (float) $car->daily_price,
            'daily_rate' => $dailyRate,
            'deposit_amount' => (float) ($validated['deposit_amount'] ?? 0),
            'tax_rate' => (float) config('pricing.tax_rate'),
            'currency' => config('pricing.currency'),
        ], $quote));
    }

    /**
     * Catalog rows → pricing inputs, in request order.
     *
     * @param  array<int, array{extra_id: int|string, quantity: int|string}>  $lines
     * @return array<int, array{pricing_type: PricingType, unit_price: string, quantity: int}>
     */
    private function extrasLines(array $lines): array
    {
        if ($lines === []) {
            return [];
        }

        $quantities = collect($lines)->mapWithKeys(
            fn (array $line) => [(int) $line['extra_id'] => (int) $line['quantity']],
        );

        $extras = Extra::query()
            ->whereIn('id', $quantities->keys()->all())
            ->get()
            ->keyBy('id');

        $resolved = [];

        foreach ($quantities as $extraId => $quantity) {
            $extra = $extras->get($extraId);

            if ($extra !== null) {
                $resolved[] = [
                    'pricing_type' => $extra->pricing_type,
                    'unit_price' => $extra->default_price,
                    'quantity' => $quantity,
                ];
            }
        }

        return $resolved;
    }
}
