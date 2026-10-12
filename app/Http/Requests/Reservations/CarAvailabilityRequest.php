<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;

class CarAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'pickup_datetime' => ['required', 'date'],
            'expected_return_datetime' => ['required', 'date', 'after:pickup_datetime'],
            // Edit mode: the reservation being edited never conflicts with itself.
            'except_reservation_id' => ['sometimes', 'nullable', 'integer'],
        ];
    }
}
