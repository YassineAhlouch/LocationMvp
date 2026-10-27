<?php

namespace App\Http\Resources;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The listing/edit card for one printed poster. Advertised cars come back as
 * the picker-friendly summary (with the slug the QR links are built from).
 *
 * @return array<string, mixed>
 */
class QrCodeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'cars' => $this->whenLoaded('cars', fn () => $this->cars
                ->map(fn (Car $car): array => [
                    'id' => $car->id,
                    'slug' => $car->slug,
                    'registration_number' => $car->registration_number,
                    'brand' => $car->brand?->name,
                    'model' => $car->model?->name,
                    'daily_price' => $car->daily_price !== null ? (float) $car->daily_price : null,
                ])
                ->values()
                ->all()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
