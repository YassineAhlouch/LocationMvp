<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_id' => $this->reservation_id,
            'payment_date' => $this->payment_date?->toIso8601String(),
            'amount' => (float) $this->amount,
            'method' => $this->method?->value,
            'reference' => $this->reference,
            'status' => $this->status?->value,
            'notes' => $this->notes,
            'created_by' => [
                'id' => $this->createdBy?->id,
                'full_name' => $this->createdBy?->full_name,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
