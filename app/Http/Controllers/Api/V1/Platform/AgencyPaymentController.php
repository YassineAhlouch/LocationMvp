<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\IndexAgencyPaymentRequest;
use App\Http\Requests\Platform\StoreAgencyPaymentRequest;
use App\Http\Requests\Platform\UpdateAgencyPaymentRequest;
use App\Http\Resources\AgencyPaymentResource;
use App\Models\AgencyPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Subscription billing: the invoices the platform issues each agency and the
 * money it collects back. Platform-only — an agency never sees another
 * tenant's invoices, and sees its own through /v1/subscription.
 */
class AgencyPaymentController extends Controller
{
    public function index(IndexAgencyPaymentRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        return AgencyPaymentResource::collection(
            AgencyPayment::query()
                ->with(['agency:id,name', 'currency:id,code,symbol,decimals'])
                ->when($filters['agency_id'] ?? null, fn ($query, $id) => $query->where('agency_id', $id))
                ->when($filters['status'] ?? null, fn ($query, $status) => match ($status) {
                    'paid' => $query->whereNotNull('paid_at'),
                    'overdue' => $query->overdue(),
                    'pending' => $query->unpaid()->whereDate('due_date', '>=', today()),
                })
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->whereHas(
                    'agency',
                    fn ($agency) => $agency->where('name', 'like', '%'.trim($term).'%'),
                ))
                ->orderByDesc('due_date')
                ->orderByDesc('id')
                ->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreAgencyPaymentRequest $request): JsonResponse
    {
        $payment = AgencyPayment::create($request->validated())->refresh();

        return (new AgencyPaymentResource($this->load($payment)))
            ->response()
            ->setStatusCode(201);
    }

    public function show(AgencyPayment $agencyPayment): AgencyPaymentResource
    {
        return new AgencyPaymentResource($this->load($agencyPayment));
    }

    public function update(UpdateAgencyPaymentRequest $request, AgencyPayment $agencyPayment): AgencyPaymentResource
    {
        $agencyPayment->update($request->validated());

        return new AgencyPaymentResource($this->load($agencyPayment->refresh()));
    }

    public function destroy(AgencyPayment $agencyPayment): Response
    {
        $agencyPayment->delete();

        return response()->noContent();
    }

    /**
     * Mark an invoice paid: freezes the amount owed and remembers which
     * platform admin confirmed it. This is what lifts an agency's read-only
     * lock.
     */
    public function pay(Request $request, AgencyPayment $agencyPayment): AgencyPaymentResource
    {
        $agencyPayment->update([
            'paid_at' => now(),
            'recorded_by' => $request->user()?->id,
        ]);

        return new AgencyPaymentResource($this->load($agencyPayment->refresh()));
    }

    /**
     * Undo a payment — used when a transfer bounces or was recorded by mistake.
     */
    public function unpay(AgencyPayment $agencyPayment): AgencyPaymentResource
    {
        $agencyPayment->update(['paid_at' => null, 'recorded_by' => null]);

        return new AgencyPaymentResource($this->load($agencyPayment->refresh()));
    }

    private function load(AgencyPayment $payment): AgencyPayment
    {
        return $payment->load(['agency:id,name', 'currency:id,code,symbol,decimals', 'recordedBy:id,name']);
    }
}
