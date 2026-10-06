<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pricing\StorePricingRuleRequest;
use App\Http\Requests\Pricing\UpdatePricingRuleRequest;
use App\Http\Resources\PricingRuleResource;
use App\Models\PricingRule;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class PricingRuleController extends Controller
{
    use LogsActivity;

    public function index(): AnonymousResourceCollection
    {
        return PricingRuleResource::collection(
            PricingRule::query()->orderBy('id')->paginate(),
        );
    }

    public function store(StorePricingRuleRequest $request): PricingRuleResource
    {
        $rule = PricingRule::create(array_merge($request->validated(), [
            'agency_id' => $request->user()->agency_id,
        ]));

        $this->logActivity(
            'pricing',
            'created',
            $rule,
            $request->user(),
            'Pricing rule created',
            null,
            $this->auditValues($rule),
        );

        return new PricingRuleResource($rule);
    }

    public function show(PricingRule $pricing_rule): PricingRuleResource
    {
        return new PricingRuleResource($pricing_rule);
    }

    public function update(UpdatePricingRuleRequest $request, PricingRule $pricing_rule): PricingRuleResource
    {
        $keys = array_keys($request->validated());
        $old = $this->auditValues($pricing_rule, $keys);

        $pricing_rule->fill($request->validated());
        $pricing_rule->save();

        $this->logActivity(
            'pricing',
            'updated',
            $pricing_rule,
            $request->user(),
            'Pricing rule updated',
            $old,
            $this->auditValues($pricing_rule, $keys),
        );

        return new PricingRuleResource($pricing_rule);
    }

    public function destroy(Request $request, PricingRule $pricing_rule): Response
    {
        $old = $this->auditValues($pricing_rule);

        $pricing_rule->delete();

        $this->logActivity(
            'pricing',
            'deleted',
            $pricing_rule,
            $request->user(),
            'Pricing rule deleted',
            $old,
        );

        return response()->noContent();
    }

    /**
     * Cast-aware attribute snapshot for the audit trail.
     *
     * @param  array<int, string>|null  $keys
     * @return array<string, mixed>
     */
    private function auditValues(PricingRule $rule, ?array $keys = null): array
    {
        if ($keys !== null) {
            return collect($keys)
                ->mapWithKeys(fn (string $key) => [$key => $rule->getAttribute($key)])
                ->all();
        }

        return collect($rule->toArray())->except(['created_at', 'updated_at'])->all();
    }
}
