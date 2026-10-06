<?php

namespace App\Http\Requests\Cars;

use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexCarRequest extends FormRequest
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
            'status' => ['sometimes', Rule::enum(CarStatus::class)],
            'category_id' => ['sometimes', 'integer'],
            'brand_id' => ['sometimes', 'integer'],
            'fuel_type' => ['sometimes', Rule::enum(FuelType::class)],
            'transmission_type' => ['sometimes', Rule::enum(TransmissionType::class)],
            'seats_count' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_by' => ['sometimes', 'string', Rule::in(['daily_price', 'year', 'created_at', 'registration_number'])],
            'sort_dir' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
