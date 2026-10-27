<?php

namespace App\Http\Requests\Landing;

use App\Enums\CarStatus;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Public submission of the landing reservation form: no client record is
 * created — staff turn this lead into a real reservation later.
 */
class StoreLandingReservationRequest extends FormRequest
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
            // Only rentable cars may be reserved from the landing.
            'car_id' => ['required', 'integer', Rule::exists('cars', 'id')->where(
                fn (Builder $query) => $query
                    ->whereNull('deleted_at')
                    ->where('is_active', true)
                    ->where('status', CarStatus::Available->value),
            )],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            // Dates are visitor intent; before_pickup keeps the window sane.
            'pickup_datetime' => ['nullable', 'date', 'after_or_equal:today'],
            'expected_return_datetime' => ['nullable', 'date', 'after:pickup_datetime'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
