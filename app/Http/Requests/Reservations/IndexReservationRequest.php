<?php

namespace App\Http\Requests\Reservations;

use App\Enums\PaymentStatus;
use App\Enums\ReservationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexReservationRequest extends FormRequest
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
            'status' => ['sometimes', 'string', Rule::enum(ReservationStatus::class)],
            'payment_status' => ['sometimes', 'string', Rule::enum(PaymentStatus::class)],
            'car_id' => ['sometimes', 'integer'],
            'client_id' => ['sometimes', 'integer'],
            'pickup_from' => ['sometimes', 'date'],
            'pickup_to' => ['sometimes', 'date'],
            'q' => ['sometimes', 'string', 'max:100'],
            'sort_by' => ['sometimes', 'string', Rule::in(['pickup_datetime', 'expected_return_datetime', 'created_at', 'total_amount', 'status'])],
            'sort_dir' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
