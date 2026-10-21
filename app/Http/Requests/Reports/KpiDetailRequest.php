<?php

namespace App\Http\Requests\Reports;

use App\Enums\KpiMetric;
use Illuminate\Validation\Rule;

/**
 * A summary request plus the KPI slug carried by the route, so both
 * dashboard endpoints accept the identical period window.
 */
class KpiDetailRequest extends SummaryDashboardRequest
{
    /**
     * Route parameters are not part of the request input Laravel validates,
     * so the slug is merged in before the rules run.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['metric' => $this->route('metric')]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'metric' => ['required', 'string', Rule::enum(KpiMetric::class)],
        ]);
    }
}
