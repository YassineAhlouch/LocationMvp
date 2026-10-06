<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;

class IndexCarModelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'q' => ['sometimes', 'string', 'max:100'],
            'brand_id' => ['sometimes', 'integer'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
