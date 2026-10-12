<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceTemplateResource;
use App\Models\InvoiceTemplate;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * The contract/invoice layouts a platform admin can assign to an agency.
 * Only active templates are offered, mirroring the agency-side settings
 * catalog.
 */
class InvoiceTemplateController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return InvoiceTemplateResource::collection(
            InvoiceTemplate::query()
                ->where('is_active', true)
                ->orderBy('id')
                ->get(),
        );
    }
}
