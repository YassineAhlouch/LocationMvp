<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgencyTemplateRequest extends FormRequest
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
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'invoice_template_id' => [
                'required',
                'integer',
                Rule::exists('invoice_templates', 'id')->where('is_active', true),
            ],
        ];
    }
}
