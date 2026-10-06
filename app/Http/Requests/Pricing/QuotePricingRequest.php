<?php

namespace App\Http\Requests\Pricing;

use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuotePricingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * HTTP validation only — the quote itself is a pure computation, so a
     * structurally valid request always yields a price breakdown.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $agencyId = app(AgencyContext::class)->id();

        return [
            'car_id' => ['required', 'integer', Rule::exists('cars', 'id')->where('agency_id', $agencyId)],
            'pickup_datetime' => ['required', 'date'],
            'expected_return_datetime' => ['required', 'date', 'after:pickup_datetime'],

            'daily_rate' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'discount_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'deposit_amount' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],

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
