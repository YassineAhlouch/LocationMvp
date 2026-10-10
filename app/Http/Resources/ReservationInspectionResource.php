<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationInspectionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type?->value,
            'mileage' => $this->mileage,
            'fuel_level' => $this->fuel_level,
            'condition_notes' => $this->condition_notes,
            'areas' => $this->areas ?? [],
            'photos' => ReservationInspectionPhotoResource::collection(
                $this->whenLoaded('photos', fn () => $this->photos),
            ),
            'inspector' => $this->inspectorSummary($this->inspector),
            'inspected_at' => $this->inspected_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{id: int, full_name: string}|null
     */
    private function inspectorSummary(?User $user): ?array
    {
        return $user !== null ? [
            'id' => $user->id,
            'full_name' => $user->full_name,
        ] : null;
    }
}
