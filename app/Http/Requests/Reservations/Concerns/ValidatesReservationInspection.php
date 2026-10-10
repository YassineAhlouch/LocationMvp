<?php

namespace App\Http\Requests\Reservations\Concerns;

use App\Enums\InspectionArea;
use App\Enums\InspectionCondition;
use Illuminate\Validation\Rule;

/**
 * Shared validation for the optional car inspection submitted with a
 * reservation transition (activate = pickup, complete = return).
 */
trait ValidatesReservationInspection
{
    /**
     * Photos arrive as multipart pairs (area + file) so several angles can be
     * attached to one phase and stored by ReservationInspectionService.
     *
     * @return array<string, array<int, mixed>>
     */
    protected function inspectionRules(): array
    {
        return [
            'inspection' => ['nullable', 'array'],
            'inspection.condition_notes' => ['nullable', 'string', 'max:5000'],
            'inspection.areas' => ['nullable', 'array'],
            'inspection.areas.*' => ['nullable', 'array'],
            'inspection.areas.*.condition' => ['nullable', Rule::enum(InspectionCondition::class)],
            'inspection.areas.*.notes' => ['nullable', 'string', 'max:1000'],
            'inspection.photos' => ['nullable', 'array', 'max:24'],
            'inspection.photos.*.area' => ['required', Rule::enum(InspectionArea::class)],
            'inspection.photos.*.file' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }
}
