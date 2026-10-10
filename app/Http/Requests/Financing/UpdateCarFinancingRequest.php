<?php

namespace App\Http\Requests\Financing;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarFinancingRequest extends FormRequest
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
            'purchase_date' => ['sometimes', 'date'],
            'purchase_price' => ['sometimes', 'numeric', 'min:0'],
            'down_payment' => ['sometimes', 'numeric', 'min:0'],
            'financed_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'installment_amount' => ['sometimes', 'numeric', 'min:0.01'],
            'installments_count' => ['sometimes', 'integer', 'min:1', 'max:240'],
            'first_due_date' => ['sometimes', 'date'],
            'lender' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}
