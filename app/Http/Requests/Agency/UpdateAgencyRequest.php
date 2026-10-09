<?php

namespace App\Http\Requests\Agency;

use App\Enums\InvoiceTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgencyRequest extends FormRequest
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
     * Only the invoice/contract layout is editable through this endpoint for
     * now. The letterhead fields (name, address, ICE, logo…) are managed
     * elsewhere.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'invoice_template' => ['required', Rule::enum(InvoiceTemplate::class)],
        ];
    }
}
