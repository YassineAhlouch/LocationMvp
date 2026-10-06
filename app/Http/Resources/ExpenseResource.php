<?php

namespace App\Http\Resources;

use App\Enums\ExpenseStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * status is the stored ledger state; is_overdue is derived (pending with
     * a due date in the past) so the UI can render badges without the ledger
     * ever holding a stale 'overdue' value.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isOverdue = $this->status === ExpenseStatus::Pending
            && $this->due_date !== null
            && $this->due_date->isBefore(today());

        return [
            'id' => $this->id,
            'car' => [
                'id' => $this->car?->id,
                'registration_number' => $this->car?->registration_number,
            ],
            'type' => $this->type?->value,
            'title' => $this->title,
            'description' => $this->description,
            'amount' => (float) $this->amount,
            'vendor' => $this->vendor,
            'start_date' => $this->start_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'paid_date' => $this->paid_date?->toDateString(),
            'attachment' => $this->attachment,
            'status' => $this->status?->value,
            'is_overdue' => $isOverdue,
            'created_by' => [
                'id' => $this->createdBy?->id,
                'first_name' => $this->createdBy?->first_name,
                'last_name' => $this->createdBy?->last_name,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
