<?php

namespace App\Http\Requests\Reservations;

use App\Enums\ReservationChangeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexReservationChangeRequest extends FormRequest
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
            'reservation_id' => ['sometimes', 'integer'],
            'change_type' => ['sometimes', Rule::enum(ReservationChangeType::class)],
            'field_name' => ['sometimes', 'string', 'max:100'],
            'created_by' => ['sometimes', 'integer'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
