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
            'currency' => $this->whenLoaded('currency', fn () => $this->currency === null ? null : [
                'id' => $this->currency->id,
                'code' => $this->currency->code,
                'name' => $this->currency->name,
                'symbol' => $this->currency->symbol,
                'decimals' => $this->currency->decimals,
            ]),
            'invoice_template' => $this->whenLoaded('invoiceTemplate', fn () => $this->invoiceTemplate === null ? null : [
                'id' => $this->invoiceTemplate->id,
                'slug' => $this->invoiceTemplate->slug,
                'name' => $this->invoiceTemplate->name,
            ]),
            'users_count' => $this->whenCounted('users_count'),
            'cars_count' => $this->whenCounted('cars_count'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
