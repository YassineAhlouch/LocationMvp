<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    /**
     * The global role catalog, so the platform can pick one when creating
     * staff. Roles are shared master data, not agency-scoped.
     */
    public function index(): AnonymousResourceCollection
    {
        return RoleResource::collection(
            Role::query()
                ->withCount('users as users_count')
                ->orderBy('name')
                ->get(),
        );
    }
}
