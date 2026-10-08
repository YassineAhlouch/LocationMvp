<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight projection for the reservation calendar. Only the fields the
 * calendar needs to draw and label an event are exposed; the full record is
 * fetched lazily when an event is opened for editing.
 */
class ReservationCalendarResource extends JsonResource
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

            'pickup_datetime' => $this->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $this->expected_return_datetime?->toIso8601String(),
            'rental_days' => $this->rental_days,
            'total_amount' => (float) $this->total_amount,

            'car' => $this->car !== null ? [
                'id' => $this->car->id,
                'registration_number' => $this->car->registration_number,
            ] : null,
            'primary_client' => $this->primaryClient !== null ? [
                'id' => $this->primaryClient->id,
                'full_name' => $this->primaryClient->full_name,
            ] : null,
        ];
    }
}
