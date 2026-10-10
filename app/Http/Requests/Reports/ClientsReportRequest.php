<?php

namespace App\Http\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;

class ClientsReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Shares the summary's period semantics: optional bounds defaulting to
     * the current calendar month.
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
