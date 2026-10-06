<?php

namespace App\Http\Requests\Payments;

use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * HTTP validation only — ledger rules (frozen reservations, status
     * derivation) belong to StorePaymentAction.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999.99'],
            'method' => ['required', Rule::enum(PaymentMethod::class)],

            // Refunded is reachable only through the refund endpoint.
            'status' => ['sometimes', Rule::in([
                PaymentRecordStatus::Paid->value,
                PaymentRecordStatus::Pending->value,
            ])],

            'payment_date' => ['sometimes', 'date'],
            'reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
