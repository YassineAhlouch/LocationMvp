<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Platform-wide invoice (reservation) listing. agency_id is optional so
     * the dashboard can browse everything, or narrow down to one tenant.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'agency_id' => ['sometimes', 'integer', Rule::exists('agencies', 'id')],
            'q' => ['sometimes', 'string', 'max:100'],
            'payment_status' => ['sometimes', 'string', Rule::in(['unpaid', 'partial', 'paid'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
