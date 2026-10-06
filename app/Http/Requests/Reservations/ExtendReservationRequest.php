<?php

namespace App\Http\Requests\Reservations;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class ExtendReservationRequest extends FormRequest
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
            'expected_return_datetime' => ['required', 'date'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $reservation = $this->route('reservation');

            if (! $reservation instanceof Reservation || ! $validator->errors()->isEmpty()) {
                return;
            }

            $newReturn = Carbon::parse($this->input('expected_return_datetime'));

            if (! $newReturn->greaterThan($reservation->expected_return_datetime)) {
                $validator->errors()->add(
                    'expected_return_datetime',
                    'The new return datetime must be after the current one.',
                );
            } elseif ($reservation->status === ReservationStatus::Active
                && ! $newReturn->greaterThan(now())) {
                $validator->errors()->add(
                    'expected_return_datetime',
                    'An active rental can only be extended into the future.',
                );
            }
        });
    }
}
