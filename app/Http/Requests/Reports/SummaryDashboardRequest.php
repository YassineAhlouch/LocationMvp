<?php

namespace App\Http\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class SummaryDashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Both bounds are optional: when omitted the service falls back to the
     * current calendar month (the natural "home view" for a dashboard).
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'from' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'to' => ['sometimes', 'date', 'date_format:Y-m-d', 'after_or_equal:from'],
        ];
    }
}
