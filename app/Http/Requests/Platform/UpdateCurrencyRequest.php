<?php

namespace App\Http\Requests\Platform;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurrencyRequest extends FormRequest
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
            'code' => ['sometimes', 'string', 'max:8', 'uppercase', Rule::unique('currencies', 'code')->ignore($this->route('currency'))],
            'name' => ['sometimes', 'string', 'max:80'],
            'symbol' => ['sometimes', 'string', 'max:8'],
            'decimals' => ['sometimes', 'integer', 'min:0', 'max:4'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge(['code' => strtoupper($this->input('code'))]);
        }
    }
}
