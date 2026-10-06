<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
{
    /**
     * Brand/model/category are always eager loaded on the list and show;
     * images appear on show (and when explicitly loaded elsewhere).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'registration_number' => $this->registration_number,
            'vin' => $this->vin,

            'brand' => [
                'id' => $this->brand?->id,
                'name' => $this->brand?->name,
            ],
            'model' => [
                'id' => $this->model?->id,
                'name' => $this->model?->name,
            ],
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ],

            'year' => $this->year,
            'color' => $this->color,
            'seats_count' => $this->seats_count,
            'doors_count' => $this->doors_count,
            'transmission_type' => $this->transmission_type?->value,
            'fuel_type' => $this->fuel_type?->value,

            'daily_price' => $this->daily_price !== null ? (float) $this->daily_price : null,
            'purchase_price' => $this->purchase_price !== null ? (float) $this->purchase_price : null,

            'initial_mileage' => $this->initial_mileage,
            'current_mileage' => $this->current_mileage,
            'current_fuel_level' => $this->current_fuel_level,

            'insurance_company' => $this->insurance_company,
            'insurance_policy_number' => $this->insurance_policy_number,
            'insurance_expiry_date' => $this->insurance_expiry_date?->toDateString(),
            'technical_inspection_expiry' => $this->technical_inspection_expiry?->toDateString(),

            'next_service_mileage' => $this->next_service_mileage,
            'last_maintenance_at' => $this->last_maintenance_at?->toDateString(),

            'status' => $this->status?->value,
            'is_active' => $this->is_active,
            'notes' => $this->notes,

            'images_count' => $this->whenCounted('images_count'),
            'images' => $this->whenLoaded('images', fn () => CarImageResource::collection($this->images)),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
