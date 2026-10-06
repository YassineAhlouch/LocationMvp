<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;

class ActivateReservationRequest extends FormRequest
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
            'pickup_mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'pickup_fuel_level' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
