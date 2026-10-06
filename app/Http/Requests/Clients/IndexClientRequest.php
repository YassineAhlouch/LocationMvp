<?php

namespace App\Http\Requests\Clients;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Boolean query strings arrive as "true"/"false" strings — normalise
     * before validation so the service can trust the value's type.
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
            'status' => ['sometimes', Rule::enum(ClientStatus::class)],
            'source' => ['sometimes', Rule::enum(ClientSource::class)],
            'is_active' => ['sometimes', 'boolean'],
            'city' => ['sometimes', 'string', 'max:255'],
            'sort_by' => ['sometimes', 'string', Rule::in(['created_at', 'last_name', 'phone', 'last_reservation_at'])],
            'sort_dir' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
