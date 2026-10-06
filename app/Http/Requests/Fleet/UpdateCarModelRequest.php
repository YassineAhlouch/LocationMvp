<?php

namespace App\Http\Requests\Fleet;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCarModelRequest extends FormRequest
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
        $model = $this->route('car_model');
        $brandId = $this->input('brand_id', $model?->brand_id);

        return [
            'brand_id' => ['sometimes', 'integer', Rule::exists('brands', 'id')],
            'name' => [
                'sometimes', 'string', 'max:255',
                Rule::unique('car_models', 'name')->where('brand_id', $brandId)->ignore($model),
            ],
        ];
    }
}
