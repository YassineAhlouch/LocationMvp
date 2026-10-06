<?php

namespace App\Http\Requests\Pricing;

use App\Enums\PricingAdjustmentType;
use App\Enums\PricingRuleType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePricingRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Season rules require a date window; day-of-week rules require ISO
     * weekdays (1=Mon..7=Sun). Either type may narrow with the other's
     * filter — the resolver ANDs window and weekdays.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $percentCap = $this->input('adjustment_type') === PricingAdjustmentType::Percent->value
            ? 'max:100'
            : 'max:99999.99';

        return [
            'name' => ['required', 'string', 'max:255'],
            'rule_type' => ['required', Rule::enum(PricingRuleType::class)],
            'starts_on' => ['required_if:rule_type,season', 'nullable', 'date'],
            'ends_on' => ['required_if:rule_type,season', 'nullable', 'date', 'after_or_equal:starts_on'],
            'days_of_week' => ['required_if:rule_type,day_of_week', 'nullable', 'array', 'min:1', 'max:7'],
            'days_of_week.*' => ['integer', 'between:1,7', 'distinct'],
            'adjustment_type' => ['required', Rule::enum(PricingAdjustmentType::class)],
            'adjustment_value' => ['required', 'numeric', 'min:0', $percentCap],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ends_on.after_or_equal' => 'The end date must be on or after the start date.',
        ];
    }

    /**
     * The cap needs adjustment_type, but that rule may fail to validate —
     * cross-field sanity here so a percentage above 100 never lands.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->input('adjustment_type') === PricingAdjustmentType::Percent->value
                && is_numeric($this->input('adjustment_value'))
                && (float) $this->input('adjustment_value') > 100) {
                $validator->errors()->add('adjustment_value', 'A percentage adjustment cannot exceed 100.');
            }
        });
    }
}
