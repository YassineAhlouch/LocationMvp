<?php

namespace App\Http\Requests\Landing;

use App\Enums\LandingReservationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Staff filtering of the reservation requests captured on the public
 * landing: a free-text search across the contact fields and an optional
 * pipeline status.
 *
 * @return array<string, array<int, string>>
 */
class IndexLandingReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'nullable',
                Rule::in(
                    array_column(
                        LandingReservationStatus::cases(),
                        'value',
                    ),
                ),
            ],
            'q' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
