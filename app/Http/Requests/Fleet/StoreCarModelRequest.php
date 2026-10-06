<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCarModelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A model name is unique within its brand only (both brands may have
     * a "Sport" trim).
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', Rule::exists('brands', 'id')],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('car_models', 'name')->where('brand_id', $this->input('brand_id')),
            ],
        ];
    }
}
