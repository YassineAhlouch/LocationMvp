<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationChangeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'field_name' => $this->field_name,
            'change_type' => $this->change_type?->value,
            'old_value' => $this->old_value,
            'new_value' => $this->new_value,
            'reason' => $this->reason,
            'created_by' => [
                'id' => $this->createdBy?->id,
                'full_name' => $this->createdBy?->full_name,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
