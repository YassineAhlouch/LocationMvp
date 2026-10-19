<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgencyCurrencyRequest extends FormRequest
{
    /**
     * Route-level authorization is handled by the 'permission:settings.manage'
     * middleware; this request only shapes/validates the payload.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Only currencies the platform has kept active can be chosen, so an agency
     * can never move onto a retired unit.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'currency_id' => [
                'required',
                'integer',
                Rule::exists('currencies', 'id')->where('is_active', true),
            ],
        ];
    }
}
