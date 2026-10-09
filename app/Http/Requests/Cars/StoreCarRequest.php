<?php

namespace App\Http\Requests\Cars;

use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * registration_number/vin are globally unique — a plate is the physical
     * identity of a vehicle, so uniqueness intentionally survives soft
     * deletes (unlike a client's phone number).
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', Rule::exists('brands', 'id')],
            'model_id' => [
                'required', 'integer',
                Rule::exists('car_models', 'id')->where('brand_id', $this->input('brand_id')),
            ],
            'category_id' => ['required', 'integer', Rule::exists('car_categories', 'id')],
            'registration_number' => ['required', 'string', 'max:30', Rule::unique('cars', 'registration_number')],
            'vin' => ['nullable', 'string', 'max:50', Rule::unique('cars', 'vin')],

            'year' => ['nullable', 'integer', 'min:1990', 'max:'.(now()->year + 1)],
            'color' => ['nullable', 'string', 'max:50'],
            'seats_count' => ['nullable', 'integer', 'min:1', 'max:20'],
            'doors_count' => ['nullable', 'integer', 'min:1', 'max:10'],
            'transmission_type' => ['nullable', Rule::enum(TransmissionType::class)],
            'fuel_type' => ['nullable', Rule::enum(FuelType::class)],

            'daily_price' => ['required', 'numeric', 'min:0.01'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],

            'initial_mileage' => ['nullable', 'integer', 'min:0'],
            'current_mileage' => ['nullable', 'integer', 'min:0'],
            'current_fuel_level' => ['nullable', 'integer', 'min:0', 'max:100'],

            'insurance_company' => ['nullable', 'string', 'max:255'],
            'insurance_policy_number' => ['nullable', 'string', 'max:255'],
            'insurance_expiry_date' => ['nullable', 'date'],
            'technical_inspection_expiry' => ['nullable', 'date'],

            'next_service_mileage' => ['nullable', 'integer', 'min:0'],
            'last_maintenance_at' => ['nullable', 'date'],

            'status' => ['sometimes', Rule::enum(CarStatus::class)],
            'is_active' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],

            'images' => ['sometimes', 'array', 'max:10'],
            'images.*.image' => ['required', 'string', 'max:2048'],
            'images.*.is_primary' => ['sometimes', 'boolean'],
            'images.*.sort_order' => ['sometimes', 'integer', 'min:0', 'max:100'],
        ];
    }
}
