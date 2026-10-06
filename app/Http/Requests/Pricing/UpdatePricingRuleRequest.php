<?php

namespace App\Http\Requests\Pricing;

use App\Enums\PricingAdjustmentType;
use App\Enums\PricingRuleType;
use App\Models\PricingRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePricingRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Partial update — absent fields stay untouched. Validation is the
     * same shape as Store, so a PATCH flipping rule_type to season still
     * demands a window.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $percentCap = $this->resolvedAdjustmentType() === PricingAdjustmentType::Percent->value
            ? 'max:100'
            : 'max:99999.99';

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'rule_type' => ['sometimes', Rule::enum(PricingRuleType::class)],
            'starts_on' => ['required_if:rule_type,season', 'nullable', 'date'],
            'ends_on' => ['required_if:rule_type,season', 'nullable', 'date', 'after_or_equal:starts_on'],
            'days_of_week' => ['required_if:rule_type,day_of_week', 'nullable', 'array', 'min:1', 'max:7'],
            'days_of_week.*' => ['integer', 'between:1,7', 'distinct'],
            'adjustment_type' => ['sometimes', Rule::enum(PricingAdjustmentType::class)],
            'adjustment_value' => ['sometimes', 'numeric', 'min:0', $percentCap],
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->resolvedAdjustmentType() === PricingAdjustmentType::Percent->value
                && is_numeric($this->input('adjustment_value'))
                && (float) $this->input('adjustment_value') > 100) {
                $validator->errors()->add('adjustment_value', 'A percentage adjustment cannot exceed 100.');
            }
        });
    }

    /**
     * Input wins; a partial payload falls back to the rule being edited
     * (route binding resolves before validation).
     */
    private function resolvedAdjustmentType(): string
    {
        $input = $this->input('adjustment_type');

        if (is_string($input)) {
            return $input;
        }

        $rule = $this->route('pricing_rule');

        if ($rule instanceof PricingRule && $rule->adjustment_type !== null) {
            return $rule->adjustment_type->value;
        }

        return '';
    }
}
