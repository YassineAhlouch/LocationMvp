<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExtraResource;
use App\Models\Extra;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExtraController extends Controller
{
    /**
     * Active extras from the catalog, in display order. Read-only slice for
     * the reservation form — extras are snapshotted at booking time, so this
     * endpoint never serves as the source of truth for history.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return ExtraResource::collection(
            Extra::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->paginate($request->integer('per_page', 100)),
        );
    }
}
