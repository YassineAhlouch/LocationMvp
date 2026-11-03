<?php

namespace App\Http\Requests\Landing;

use App\Enums\LandingReservationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Moving a captured landing request along the staff pipeline.
 *
 * @return array<string, array<int, string>>
 */
class UpdateLandingReservationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(
                    array_column(
                        LandingReservationStatus::cases(),
                        'value',
                    ),
                ),
            ],
        ];
    }
}
