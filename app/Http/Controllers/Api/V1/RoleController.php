<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\RoleInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\IndexRoleRequest;
use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    use LogsActivity;

    public function index(IndexRoleRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        return RoleResource::collection(
            Role::query()
                ->withCount('users as users_count')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where('name', 'like', '%'.trim($term).'%'))
                // NB: array_key_exists, not when($value) — see fleet module.
                ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
                ->orderBy('name', 'asc')
                ->paginate(min((int) ($filters['per_page'] ?? 50), 100)),
        );
    }

    /**
     * The catalog the role editor renders. Permissions are code (this
     * config), roles are data — the client never invents verbs.
     */
    public function permissions(): JsonResponse
    {
        $catalog = collect(config('permissions', []))
            ->map(fn (array $actions, string $module) => [
                'module' => $module,
                'actions' => array_values($actions),
            ])
            ->values();

        return response()->json($catalog);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = Role::create($request->validated());

        $this->logActivity('roles', 'created', $role, $request->user(), 'Role created', null, [
            'name' => $role->name,
            'permissions' => $role->permissions,
        ]);

        return (new RoleResource($role))->response()->setStatusCode(201);
    }

    public function show(Role $role): RoleResource
    {
        $role->loadCount('users as users_count');

        return new RoleResource($role);
    }

    public function update(UpdateRoleRequest $request, Role $role): RoleResource
    {
        $validated = $request->validated();
        $keys = array_keys($validated);
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $role->getAttribute($key)])->all();

        // A living role cannot be frozen while people hold it — reassign
        // first. Roles are global, so this protects every agency at once.
        if (array_key_exists('is_active', $validated)
            && ! $validated['is_active']
            && $role->users()->where('is_active', true)->exists()) {
            throw new RoleInUseException;
        }

        $role->fill($validated);
        $role->save();

        $this->logActivity(
            'roles',
            'updated',
            $role,
            $request->user(),
            'Role updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $role->getAttribute($key)])->all(),
        );

        return new RoleResource($role->loadCount('users as users_count'));
    }
}
