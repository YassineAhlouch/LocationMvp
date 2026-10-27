<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The card the public landing renders for a scanned QR: contact-safe slice of
 * a car (no plates, no VIN, no fleet internals) plus the agency and currency
 * it is priced in.
 *
 * @return array<string, mixed>
 */
class LandingCarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'brand' => $this->brand?->name,
            'model' => $this->model?->name,
            'category' => $this->category?->name,
            'year' => $this->year,
            'color' => $this->color,
            'seats_count' => $this->seats_count,
            'doors_count' => $this->doors_count,
            'transmission_type' => $this->transmission_type?->value,
            'fuel_type' => $this->fuel_type?->value,
            'daily_price' => (float) $this->daily_price,

            /** The primary gallery photo first, falling back to any photo. */
            'cover_image' => ($this->images->firstWhere('is_primary') ?? $this->images->first())?->image,

            'agency' => [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
                'currency_code' => $this->agency->currency->code,
                'currency_symbol' => $this->agency->currency->symbol,
            ],
        ];
    }
}
