<?php

namespace App\Http\Requests\Financing;

use Illuminate\Foundation\Http\FormRequest;

class MarkInstallmentPaidRequest extends FormRequest
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
            'paid_date' => ['sometimes', 'date'],
            'reference' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
