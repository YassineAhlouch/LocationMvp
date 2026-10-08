<?php

namespace App\Http\Requests\Reservations;

use App\Enums\PricingType;
use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Contracts\Validation\Validator;
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

            // Lifecycle: the state machine (ReservationStatus::canTransitionTo)
            // is enforced inside UpdateReservationAction under lock.
            'status' => ['sometimes', Rule::enum(ReservationStatus::class)],
            'status_reason' => ['nullable', 'string', 'max:500'],

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
            // Each line is either a catalog extra (extra_id) or a free-form
            // extra typed on the booking form (name + pricing_type +
            // unit_price). Either form may carry quantity/description.
            'extras.*.extra_id' => [
                'integer',
                Rule::exists('extras', 'id')->where('agency_id', $agencyId)->where('is_active', true),
            ],
            'extras.*.name' => ['string', 'max:255'],
            'extras.*.description' => ['nullable', 'string', 'max:1000'],
            'extras.*.pricing_type' => [Rule::enum(PricingType::class)],
            'extras.*.unit_price' => ['numeric', 'min:0', 'max:99999.99'],
            'extras.*.quantity' => ['integer', 'min:1', 'max:99'],
        ];
    }

    /**
     * Enforce per-line integrity: a line without a catalog extra must carry
     * the free-form fields (name, pricing type, unit price) and a quantity.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $extras = $validator->getData()['extras'] ?? [];

                if (! is_array($extras)) {
                    return;
                }

                foreach ($extras as $index => $line) {
                    if (! empty($line['extra_id'] ?? null)) {
                        continue;
                    }

                    foreach (['name', 'pricing_type', 'unit_price', 'quantity'] as $field) {
                        $value = $line[$field] ?? null;

                        if ($field !== 'quantity' && ($value === null || $value === '')) {
                            $validator->errors()->add("extras.$index.$field", "A custom extra requires the $field.");
                        }

                        if ($field === 'quantity' && ($value === null || $value === '')) {
                            $validator->errors()->add("extras.$index.$field", 'The quantity is required.');
                        }
                    }
                }
            },
        ];
    }
}
