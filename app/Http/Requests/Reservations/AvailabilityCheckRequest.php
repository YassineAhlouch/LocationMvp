<?php

namespace App\Http\Requests\Reservations;

use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AvailabilityCheckRequest extends FormRequest
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
            'car_id' => [
                'required',
                'integer',
                Rule::exists('cars', 'id')->where('agency_id', app(AgencyContext::class)->id()),
            ],
            'pickup_datetime' => ['required', 'date'],
            'expected_return_datetime' => ['required', 'date', 'after:pickup_datetime'],
        ];
    }
}
