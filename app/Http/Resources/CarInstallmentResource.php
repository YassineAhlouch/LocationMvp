<?php

namespace App\Http\Resources;

use App\Enums\InstallmentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarInstallmentResource extends JsonResource
{
    /**
     * status is the stored state; is_overdue is derived (unpaid + due date in
     * the past) so the UI can render badges even before the sweep runs.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'financing_id' => $this->financing_id,
            'car_id' => $this->car_id,
            'installment_number' => $this->installment_number,
            'due_date' => $this->due_date?->toDateString(),
            'amount' => (float) $this->amount,
            'paid_date' => $this->paid_date?->toDateString(),
            'status' => $this->isOverdue() ? InstallmentStatus::Overdue->value : $this->status?->value,
            'is_overdue' => $this->isOverdue(),
            'reference' => $this->reference,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
