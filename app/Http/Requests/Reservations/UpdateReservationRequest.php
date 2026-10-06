<?php

namespace App\Http\Requests\Reservations;

use App\Models\Reservation;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Injects the current pickup datetime when only the return moves, so the
     * cross-field `after:` rule validates against the real window.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('expected_return_datetime') && ! $this->filled('pickup_datetime')) {
            $reservation = $this->route('reservation');

            if ($reservation instanceof Reservation) {
                $this->merge(['pickup_datetime' => $reservation->pickup_datetime->toDateTimeString()]);
            }
        }
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $agencyId = app(AgencyContext::class)->id();

        return [
            'car_id' => ['sometimes', 'integer', Rule::exists('cars', 'id')->where('agency_id', $agencyId)],
            'primary_client_id' => ['sometimes', 'integer', Rule::exists('clients', 'id')->where('agency_id', $agencyId)],
            'secondary_client_id' => ['nullable', 'integer', Rule::exists('clients', 'id')->where('agency_id', $agencyId)],

            'primary_driver_name' => ['nullable', 'string', 'max:255'],
            'primary_driver_phone' => ['nullable', 'string', 'max:255'],
            'primary_driver_cin' => ['nullable', 'string', 'max:255'],
            'primary_driver_passport' => ['nullable', 'string', 'max:255'],
            'primary_driver_license' => ['nullable', 'string', 'max:255'],
            'secondary_driver_name' => ['nullable', 'string', 'max:255'],
            'secondary_driver_phone' => ['nullable', 'string', 'max:255'],
            'secondary_driver_cin' => ['nullable', 'string', 'max:255'],
            'secondary_driver_passport' => ['nullable', 'string', 'max:255'],
            'secondary_driver_license' => ['nullable', 'string', 'max:255'],

            'pickup_location' => ['nullable', 'string', 'max:255'],
            'return_location' => ['nullable', 'string', 'max:255'],

            'pickup_datetime' => ['sometimes', 'date'],
            'expected_return_datetime' => ['sometimes', 'date', 'after:pickup_datetime'],

            'daily_rate' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'discount_reason' => ['nullable', 'string', 'max:255'],
            'deposit_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'remarks' => ['nullable', 'string', 'max:5000'],

            'extras' => ['sometimes', 'array', 'max:20'],
            'extras.*.extra_id' => [
                'required',
                'integer',
                Rule::exists('extras', 'id')->where('agency_id', $agencyId)->where('is_active', true),
            ],
            'extras.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }
}
