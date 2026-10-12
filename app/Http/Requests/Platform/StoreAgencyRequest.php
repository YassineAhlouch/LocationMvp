<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAgencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A new agency, optionally together with its first administrator so the
     * tenant is usable the moment it is created (email stays globally unique).
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:1000'],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'ice' => ['nullable', 'string', 'max:60'],
            'rc' => ['nullable', 'string', 'max:60'],
            'daily_mileage_allowance' => ['nullable', 'integer', 'min:0', 'max:65000'],
            'extra_mileage_fee_per_km' => ['nullable', 'numeric', 'min:0'],
            'currency_id' => ['nullable', 'integer', Rule::exists('currencies', 'id')->where('is_active', true)],
            'invoice_template_id' => ['nullable', 'integer', Rule::exists('invoice_templates', 'id')->where('is_active', true)],
            'is_active' => ['sometimes', 'boolean'],

            'admin' => ['sometimes', 'array'],
            'admin.first_name' => ['required_with:admin', 'string', 'max:255'],
            'admin.last_name' => ['required_with:admin', 'string', 'max:255'],
            'admin.email' => ['required_with:admin', 'email', 'max:255', Rule::unique('users', 'email')],
            'admin.phone' => ['nullable', 'string', 'max:30'],
            'admin.password' => ['required_with:admin', 'string', 'min:8'],
            'admin.role_id' => ['nullable', 'integer', Rule::exists('roles', 'id')->where('is_active', true)],
        ];
    }
}
