<?php

namespace App\Http\Requests\Expenses;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'q' => ['sometimes', 'string', 'max:100'],
            // 'overdue' is a derived view over pending expenses whose due
            // date has passed — accepted here even though CRUD cannot store it.
            'status' => ['sometimes', Rule::in([
                ExpenseStatus::Pending->value,
                ExpenseStatus::Paid->value,
                ExpenseStatus::Overdue->value,
            ])],
            'type' => ['sometimes', Rule::enum(ExpenseType::class)],
            'car_id' => ['sometimes', 'integer'],
            'due_from' => ['sometimes', 'date'],
            'due_to' => ['sometimes', 'date'],
            'sort_by' => ['sometimes', 'string', Rule::in(['due_date', 'amount', 'created_at', 'title'])],
            'sort_dir' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
