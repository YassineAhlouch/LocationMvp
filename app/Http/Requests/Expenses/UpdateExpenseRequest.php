<?php

namespace App\Http\Requests\Expenses;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Models\Car;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Same shape as creation; only pending/paid are writable states.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'car_id' => [
                'sometimes', 'integer',
                function ($attribute, $value, $fail): void {
                    if (! Car::whereKey($value)->exists()) {
                        $fail('The selected car is invalid.');
                    }
                },
            ],
            'type' => ['sometimes', Rule::enum(ExpenseType::class)],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'paid_date' => ['nullable', 'date'],
            'attachment' => ['nullable', 'string', 'max:2048'],
            'status' => ['sometimes', Rule::in([
                ExpenseStatus::Pending->value,
                ExpenseStatus::Paid->value,
            ])],
        ];
    }
}
