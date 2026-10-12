<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexAgencyPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Platform billing listing. agency_id is optional so the dashboard can
     * watch every tenant, or narrow down to one; status maps to the derived
     * paid/overdue/pending states.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'agency_id' => ['sometimes', 'integer', Rule::exists('agencies', 'id')],
            'status' => ['sometimes', 'string', Rule::in(['pending', 'paid', 'overdue'])],
            'q' => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
