<?php

namespace App\Http\Requests\Reservations;

use App\Http\Requests\Reservations\Concerns\ValidatesReservationInspection;
use Illuminate\Foundation\Http\FormRequest;

class ActivateReservationRequest extends FormRequest
{
    use ValidatesReservationInspection;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return array_merge([
            'pickup_mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'pickup_fuel_level' => ['nullable', 'integer', 'min:0', 'max:100'],
        ], $this->inspectionRules());
    }
}
