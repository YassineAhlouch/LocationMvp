<?php

namespace App\Http\Requests\Expenses;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Models\Car;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Only pending/paid are storable ledger states; overdue is derived and
     * must never be written, or the ledger would go stale.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'car_id' => [
                'required', 'integer',
                function ($attribute, $value, $fail): void {
                    // Car carries the agency scope (and excludes trashed
                    // cars), so a foreign or retired car cannot be billed.
                    if (! Car::whereKey($value)->exists()) {
                        $fail('The selected car is invalid.');
                    }
                },
            ],
            'type' => ['required', Rule::enum(ExpenseType::class)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'amount' => ['required', 'numeric', 'min:0.01'],
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
