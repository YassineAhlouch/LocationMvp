<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgencyController extends Controller
{
    /**
     * The authenticated user's own agency, including the letterhead fields
     * printed on contracts. Not permission-gated: every signed-in user needs
     * their agency's document details regardless of module access.
     */
    public function show(Request $request): JsonResponse
    {
        $agency = $request->user()->agency;

        abort_if($agency === null, 404, 'No agency is associated with this account.');

        return response()->json((new AgencyResource($agency))->resolve());
    }
}
