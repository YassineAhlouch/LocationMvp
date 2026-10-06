<?php

namespace App\Http\Requests\Reservations;

use App\Models\Reservation;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class CompleteReservationRequest extends FormRequest
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
            'return_mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'return_fuel_level' => ['nullable', 'integer', 'min:0', 'max:100'],
            'actual_return_datetime' => ['nullable', 'date'],
            'reported_issues' => ['nullable', 'string', 'max:5000'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $reservation = $this->route('reservation');
            $mileage = $this->input('return_mileage');

            if ($reservation instanceof Reservation
                && $mileage !== null
                && $reservation->pickup_mileage !== null
                && (int) $mileage < $reservation->pickup_mileage) {
                $validator->errors()->add(
                    'return_mileage',
                    'The return mileage cannot be lower than the pickup mileage.',
                );
            }
        });
    }
}
