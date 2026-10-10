<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarFinancingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'car_id' => $this->car_id,
            'purchase_date' => $this->purchase_date?->toDateString(),
            'purchase_price' => (float) $this->purchase_price,
            'down_payment' => (float) $this->down_payment,
            'financed_amount' => (float) $this->financed_amount,
            'installment_amount' => (float) $this->installment_amount,
            'installments_count' => $this->installments_count,
            'first_due_date' => $this->first_due_date?->toDateString(),
            'lender' => $this->lender,
            'notes' => $this->notes,
            'installments' => CarInstallmentResource::collection($this->whenLoaded('installments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
