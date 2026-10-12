<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Agency view for the platform dashboard: the full profile plus the counts
 * that make the agency list meaningful at a glance.
 */
class PlatformAgencyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'ice' => $this->ice,
            'rc' => $this->rc,
            'logo' => $this->logo_path,
            'daily_mileage_allowance' => (int) $this->daily_mileage_allowance,
            'extra_mileage_fee_per_km' => (float) $this->extra_mileage_fee_per_km,
            'is_active' => $this->is_active,
            'users_count' => $this->whenCounted('users_count'),
            'cars_count' => $this->whenCounted('cars_count'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
