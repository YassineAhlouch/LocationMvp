<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateAgencyTemplateRequest;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\InvoiceTemplateResource;
use App\Models\Agency;
use App\Models\InvoiceTemplate;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    use LogsActivity;

    /**
     * The catalog the assignment screen renders. Only active layouts are
     * offered so a retired design is never handed out again. Ordered by id so
     * the built-in classic design stays first.
     */
    public function invoiceTemplates(): JsonResponse
    {
        $templates = InvoiceTemplate::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        return response()->json(InvoiceTemplateResource::collection($templates)->resolve());
    }

    /**
     * Every agency with its assigned layout. Agencies are the tenant root and
     * carry no agency scope, so this legitimately spans all of them.
     */
    public function agencies(): JsonResponse
    {
        $agencies = Agency::query()
            ->with('invoiceTemplate')
            ->orderBy('name')
            ->get();

        return response()->json(AgencyResource::collection($agencies)->resolve());
    }

    /**
     * Assign one invoice layout to an agency. Administrative decision: an
     * agency user can never switch layouts themselves.
     */
    public function updateAgencyTemplate(UpdateAgencyTemplateRequest $request, Agency $agency): JsonResponse
    {
        $old = ['invoice_template_id' => $agency->invoice_template_id];

        $agency->update([
            'invoice_template_id' => $request->integer('invoice_template_id'),
        ]);

        $this->logActivity(
            'settings',
            'updated',
            $agency,
            $request->user(),
            'Invoice template changed',
            $old,
            ['invoice_template_id' => $agency->invoice_template_id],
        );

        return response()->json((new AgencyResource($agency->load('invoiceTemplate')))->resolve());
    }
}
