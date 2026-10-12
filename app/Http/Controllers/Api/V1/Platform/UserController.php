<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\IndexUserRequest;
use App\Http\Requests\Platform\StoreUserRequest;
use App\Http\Requests\Platform\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Cross-agency staff management: the platform creates and maintains the
 * users of every agency. The agency is always explicit in the payload (a
 * normal, agency-scoped user inherits it instead).
 */
class UserController extends Controller
{
    public function index(IndexUserRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $direction = ($filters['sort_dir'] ?? null) === 'asc' ? 'asc' : 'desc';
        $sortBy = in_array($filters['sort_by'] ?? null, ['created_at', 'email', 'last_login_at', 'name'], true)
            ? $filters['sort_by']
            : 'created_at';

        $query = User::query()
            ->with([
                'role:id,name,permissions,is_active',
                'agency:id,name',
            ])
            ->when($filters['agency_id'] ?? null, fn ($query, $agencyId) => $query->where('agency_id', $agencyId))
            ->when($filters['role_id'] ?? null, fn ($query, $roleId) => $query->where('role_id', $roleId))
            // NB: array_key_exists, not when($value) — is_active=false is a
            // legitimate filter and when(false, ...) would silently skip it.
            ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(function ($builder) use ($term) {
                $like = '%'.trim($term).'%';

                $builder->where('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            }));

        if ($sortBy === 'name') {
            $query->orderBy('first_name', $direction)->orderBy('last_name', $direction);
        } else {
            $query->orderBy($sortBy, $direction);
        }

        return UserResource::collection(
            $query->orderByDesc('id')->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::query()->create($request->validated());

        return (new UserResource($user->refresh()->load(['role:id,name,permissions,is_active', 'agency:id,name'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->load(['role:id,name,permissions,is_active', 'agency:id,name']));
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $data = $request->validated();

        if (array_key_exists('password', $data) && blank($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return new UserResource($user->load(['role:id,name,permissions,is_active', 'agency:id,name']));
    }
}
