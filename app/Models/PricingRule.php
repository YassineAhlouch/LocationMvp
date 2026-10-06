<?php

namespace App\Models;

use App\Enums\PricingAdjustmentType;
use App\Enums\PricingRuleType;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Seasonal / day-of-week rate modifier resolved per calendar day by
 * PricingRuleResolver. Matching rules stack: percent points add on the
 * base rate, fixed amounts sum per day.
 */
#[Fillable([
    'agency_id',
    'name',
    'rule_type',
    'starts_on',
    'ends_on',
    'days_of_week',
    'adjustment_type',
    'adjustment_value',
    'is_active',
])]
class PricingRule extends Model
{
    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'rule_type' => PricingRuleType::class,
            'starts_on' => 'date',
            'ends_on' => 'date',
            'days_of_week' => 'array',
            'adjustment_type' => PricingAdjustmentType::class,
            'adjustment_value' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
