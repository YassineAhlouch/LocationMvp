<?php

namespace App\Http\Requests\Reservations;

use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use App\Enums\PricingType;
use App\Enums\ReservationStatus;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * HTTP validation only — availability, car status and pricing are
     * business rules owned by CreateReservationAction (409/422 + code).
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $agencyId = app(AgencyContext::class)->id();

        return [
            'car_id' => ['required', 'integer', Rule::exists('cars', 'id')->where('agency_id', $agencyId)],
            'primary_client_id' => ['required', 'integer', Rule::exists('clients', 'id')->where('agency_id', $agencyId)],
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

            'pickup_datetime' => ['required', 'date'],
            'expected_return_datetime' => ['required', 'date', 'after:pickup_datetime'],

            'daily_rate' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'discount_reason' => ['nullable', 'string', 'max:255'],
            'deposit_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'remarks' => ['nullable', 'string', 'max:5000'],

            // Startup status: the state machine owns the rest. `confirmed`
            // and `reserved` mark the car reserved in the same transaction
            // (like the dedicated confirm endpoint); active/completed/
            // cancelled/no_show are reachable only through lifecycle actions.
            'status' => ['sometimes', Rule::in([
                ReservationStatus::Pending->value,
                ReservationStatus::Confirmed->value,
                ReservationStatus::Reserved->value,
            ])],

            // Optional first payments on the ledger — payment_status on the
            // reservation derives from them, never from this payload. Both the
            // plural array (form) and the legacy singular shape are accepted.
            'payment' => ['sometimes', 'array'],
            'payment.amount' => ['required_with:payment', 'numeric', 'min:0.01', 'max:99999.99'],
            'payment.method' => ['required_with:payment', Rule::enum(PaymentMethod::class)],
            'payment.status' => ['sometimes', Rule::in([
                PaymentRecordStatus::Paid->value,
                PaymentRecordStatus::Pending->value,
            ])],
            'payment.payment_date' => ['sometimes', 'date'],
            'payment.reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payment.notes' => ['sometimes', 'nullable', 'string', 'max:2000'],

            'payments' => ['sometimes', 'array', 'max:10'],
            'payments.*.amount' => ['required', 'numeric', 'min:0.01', 'max:99999.99'],
            'payments.*.method' => ['required', Rule::enum(PaymentMethod::class)],
            'payments.*.status' => ['sometimes', Rule::in([
                PaymentRecordStatus::Paid->value,
                PaymentRecordStatus::Pending->value,
            ])],
            'payments.*.payment_date' => ['sometimes', 'date'],
            'payments.*.reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payments.*.notes' => ['sometimes', 'nullable', 'string', 'max:2000'],

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
