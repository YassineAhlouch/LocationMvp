<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * One reservation request left on the public landing, with the car it
 * targets. Staff-facing: full contact details included.
 *
 * @return array<string, mixed>
 */
class LandingReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'message' => $this->message,
            'pickup_datetime' => $this->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $this->expected_return_datetime?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),

            'car' => $this->whenLoaded('car', fn () => $this->car ? [
                'id' => $this->car->id,
                'slug' => $this->car->slug,
                'registration_number' => $this->car->registration_number,
                'brand' => $this->car->brand?->name,
                'model' => $this->car->model?->name,
                'cover_image' => ($this->car->images->firstWhere('is_primary') ?? $this->car->images->first())?->image,
            ] : null),
        ];
    }
}
