<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A subscription invoice the platform issues to one agency. `status` is
 * derived (paid/overdue/pending) so it can never drift from `paid_at`.
 */
class AgencyPaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => (float) $this->amount,
            'period' => $this->period,
            'due_date' => $this->due_date?->toDateString(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'status' => $this->status(),
            'reference' => $this->reference,
            'notes' => $this->notes,
            'agency' => $this->whenLoaded('agency', fn () => $this->agency === null ? null : [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
            ]),
            'currency' => $this->whenLoaded('currency', fn () => $this->currency === null ? null : [
                'id' => $this->currency->id,
                'code' => $this->currency->code,
                'symbol' => $this->currency->symbol,
                'decimals' => $this->currency->decimals,
            ]),
            'recorded_by' => $this->whenLoaded('recordedBy', fn () => $this->recordedBy === null ? null : [
                'id' => $this->recordedBy->id,
                'name' => $this->recordedBy->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
