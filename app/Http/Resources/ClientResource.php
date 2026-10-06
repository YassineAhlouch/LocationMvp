<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,

            'phone' => $this->phone,
            'secondary_phone' => $this->secondary_phone,
            'email' => $this->email,

            'cin' => $this->cin,
            'passport_number' => $this->passport_number,
            'driving_license_number' => $this->driving_license_number,
            'driving_license_expiry' => $this->driving_license_expiry?->toDateString(),

            'birth_date' => $this->birth_date?->toDateString(),
            'birth_place' => $this->birth_place,
            'nationality' => $this->nationality,

            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,

            'notes' => $this->notes,
            'source' => $this->source?->value,
            'status' => $this->status?->value,
            'is_active' => $this->is_active,

            'bookings_count' => $this->whenCounted('bookings_count'),

            'last_reservation_at' => $this->last_reservation_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
