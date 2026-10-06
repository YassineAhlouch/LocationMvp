<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Boolean query strings arrive as "true"/"false" — normalise before
     * validation so the service can trust the value's type.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'q' => ['sometimes', 'string', 'max:100'],
            'role_id' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_by' => ['sometimes', 'string', Rule::in(['name', 'email', 'created_at', 'last_login_at'])],
            'sort_dir' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
