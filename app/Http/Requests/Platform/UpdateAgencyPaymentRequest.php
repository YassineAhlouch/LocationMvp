<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgencyPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'agency_id' => ['sometimes', 'integer', Rule::exists('agencies', 'id')],
            'currency_id' => ['nullable', 'integer', Rule::exists('currencies', 'id')],
            'amount' => ['sometimes', 'numeric', 'min:0', 'max:99999999'],
            'period' => ['nullable', 'string', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'due_date' => ['sometimes', 'date'],
            'reference' => ['nullable', 'string', 'max:80'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
