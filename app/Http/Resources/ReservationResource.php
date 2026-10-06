<?php

namespace App\Http\Resources;

use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_number' => $this->reservation_number,
            'status' => $this->status?->value,
            'payment_status' => $this->payment_status?->value,

            'car' => [
                'id' => $this->car?->id,
                'registration_number' => $this->car?->registration_number,
                'daily_price' => $this->car !== null ? (float) $this->car->daily_price : null,
            ],
            'primary_client' => $this->clientSummary($this->primaryClient),
            'secondary_client' => $this->clientSummary($this->secondaryClient),

            'primary_driver' => [
                'name' => $this->primary_driver_name,
                'phone' => $this->primary_driver_phone,
                'cin' => $this->primary_driver_cin,
                'passport' => $this->primary_driver_passport,
                'license' => $this->primary_driver_license,
            ],
            'secondary_driver' => [
                'name' => $this->secondary_driver_name,
                'phone' => $this->secondary_driver_phone,
                'cin' => $this->secondary_driver_cin,
                'passport' => $this->secondary_driver_passport,
                'license' => $this->secondary_driver_license,
            ],

            'pickup_location' => $this->pickup_location,
            'return_location' => $this->return_location,

            'pickup_datetime' => $this->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $this->expected_return_datetime?->toIso8601String(),
            'actual_return_datetime' => $this->actual_return_datetime?->toIso8601String(),

            'pickup_mileage' => $this->pickup_mileage,
            'return_mileage' => $this->return_mileage,
            'pickup_fuel_level' => $this->pickup_fuel_level,
            'return_fuel_level' => $this->return_fuel_level,

            'daily_rate' => (float) $this->daily_rate,
            'rental_days' => $this->rental_days,
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'discount_reason' => $this->discount_reason,
            'tax_amount' => (float) $this->tax_amount,
            'deposit_amount' => (float) $this->deposit_amount,
            'total_amount' => (float) $this->total_amount,

            'extras' => $this->whenLoaded('extras', fn () => $this->extras->map(fn ($extra) => [
                'name' => $extra->name,
                'pricing_type' => $extra->pricing_type?->value,
                'quantity' => $extra->quantity,
                'unit_price' => (float) $extra->unit_price,
                'total_price' => (float) $extra->total_price,
            ])->values()),

            'remarks' => $this->remarks,
            'reported_issues' => $this->reported_issues,

            'changes' => ReservationChangeResource::collection(
                $this->whenLoaded('changes', fn () => $this->resource->changes),
            ),

            'created_by' => $this->userSummary($this->createdBy),
            'approved_by' => $this->userSummary($this->approvedBy),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function clientSummary(?Client $client): ?array
    {
        return $client !== null ? [
            'id' => $client->id,
            'full_name' => $client->full_name,
            'phone' => $client->phone,
        ] : null;
    }

    private function userSummary(?User $user): ?array
    {
        return $user !== null ? [
            'id' => $user->id,
            'full_name' => $user->full_name,
        ] : null;
    }
}
