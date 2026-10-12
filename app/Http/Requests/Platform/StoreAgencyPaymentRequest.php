<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAgencyPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A subscription invoice the platform issues to one agency. `period` is a
     * YYYY-MM label so a monthly subscription is self-describing.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'agency_id' => ['required', 'integer', Rule::exists('agencies', 'id')],
            'currency_id' => ['nullable', 'integer', Rule::exists('currencies', 'id')],
            'amount' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'period' => ['nullable', 'string', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'due_date' => ['required', 'date'],
            'reference' => ['nullable', 'string', 'max:80'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
