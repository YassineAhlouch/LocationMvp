<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\LastAdminException;
use App\Exceptions\Domain\SelfDeactivationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\IndexUserRequest;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\Activity\LogsActivity;
use App\Services\Users\UserQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Arr;

class UserController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly UserQueryService $users) {}

    public function index(IndexUserRequest $request): AnonymousResourceCollection
    {
        return UserResource::collection($this->users->paginate($request->validated()));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create(array_merge($request->validated(), [
            // Actors can only provision staff inside their own agency; the
            // payload can never carry agency_id.
            'agency_id' => $request->user()->agency_id,
        ]));

        // create() carries only the attributes passed in — refresh so the
        // response reflects the DB default (is_active=true).
        $user->refresh();

        $this->loadRelations($user);

        $this->logActivity('users', 'created', $user, $request->user(), 'User created', null, $this->auditValues($user));

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function show(User $user): UserResource
    {
        $this->loadRelations($user);

        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $validated = $request->validated();
        $actor = $request->user();

        $this->guardSelfDeactivation($user, $actor, $validated);
        $this->guardLastAdmin($user, $validated);

        // The password hash is a derived secret — never part of the diff.
        $keys = array_values(array_diff(array_keys($validated), ['password']));
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $user->getAttribute($key)])->all();

        $user->fill(Arr::except($validated, ['password']));

        if (! empty($validated['password'])) {
            $user->password = $validated['password']; // 'hashed' cast applies.
        }

        $user->save();

        $this->loadRelations($user);

        $this->logActivity(
            'users',
            'updated',
            $user,
            $actor,
            'User updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $user->getAttribute($key)])->all(),
        );

        return new UserResource($user);
    }

    /**
     * You cannot switch off your own account — the request that did it would
     * be the last thing your token ever did.
     */
    private function guardSelfDeactivation(User $user, User $actor, array $validated): void
    {
        if ($user->id === $actor->id
            && array_key_exists('is_active', $validated)
            && ! $validated['is_active']) {
            throw new SelfDeactivationException;
        }
    }

    /**
     * Deactivating or demoting the target must not strip the agency of its
     * last '*' grantee. Only the agency's own staff count (global scope).
     */
    private function guardLastAdmin(User $user, array $validated): void
    {
        $user->loadMissing('role');

        $isMaster = $user->is_active && in_array('*', $user->role?->permissions ?? [], true);

        if (! $isMaster) {
            return;
        }

        $stillActive = ! array_key_exists('is_active', $validated) || (bool) $validated['is_active'];
        $roleChanged = array_key_exists('role_id', $validated) && (int) $validated['role_id'] !== (int) $user->role_id;

        if ($stillActive && ! $roleChanged) {
            return;
        }

        $masterRoleIds = Role::query()
            ->get()
            ->filter(fn (Role $role) => in_array('*', $role->permissions, true))
            ->pluck('id');

        $otherMastersExist = User::query()
            ->where('id', '!=', $user->id)
            ->where('is_active', true)
            ->whereIn('role_id', $masterRoleIds)
            ->exists();

        if (! $otherMastersExist) {
            throw new LastAdminException;
        }
    }

    private function loadRelations(User $user): void
    {
        $user->load([
            'role:id,name,permissions,is_active',
            'agency:id,name',
        ]);
    }

    /**
     * Cast-aware attribute snapshot for the audit trail. The password column
     * is hidden from toArray(), so a full snapshot never leaks the hash.
     *
     * @param  array<int, string>|null  $keys
     * @return array<string, mixed>
     */
    private function auditValues(User $user, ?array $keys = null): array
    {
        if ($keys !== null) {
            return collect($keys)
                ->mapWithKeys(fn (string $key) => [$key => $user->getAttribute($key)])
                ->all();
        }

        return collect($user->toArray())->except(['created_at', 'updated_at', 'deleted_at'])->all();
    }
}
