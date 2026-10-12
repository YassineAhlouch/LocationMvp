<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\IndexAgencyRequest;
use App\Http\Requests\Platform\StoreAgencyRequest;
use App\Http\Requests\Platform\UpdateAgencyRequest;
use App\Http\Resources\PlatformAgencyResource;
use App\Models\Agency;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Cross-agency agency management. No agency scope applies here (platform
 * requests never set an AgencyContext), so every agency is visible.
 */
class AgencyController extends Controller
{
    public function index(IndexAgencyRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $direction = ($filters['sort_dir'] ?? null) === 'asc' ? 'asc' : 'desc';
        $sortBy = in_array($filters['sort_by'] ?? null, ['name', 'created_at'], true) ? $filters['sort_by'] : 'created_at';

        return PlatformAgencyResource::collection(
            Agency::query()
                ->with('currency:id,code,name,symbol,decimals')
                ->with('invoiceTemplate:id,slug,name')
                ->withCount(['users', 'cars'])
                ->withSum(['agencyPayments as outstanding_amount' => fn ($query) => $query->whereNull('paid_at')], 'amount')
                ->withExists(['agencyPayments as has_overdue_payment' => fn ($query) => $query->whereNull('paid_at')->whereDate('due_date', '<', today())])
                ->withMin(['agencyPayments as next_due_date' => fn ($query) => $query->whereNull('paid_at')], 'due_date')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(function ($builder) use ($term) {
                    $like = '%'.trim($term).'%';

                    $builder->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('city', 'like', $like);
                }))
                ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
                ->orderBy($sortBy, $direction)
                ->orderByDesc('id')
                ->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreAgencyRequest $request): JsonResponse
    {
        $data = $request->validated();

        $agency = DB::transaction(function () use ($data) {
            $agency = Agency::query()->create(collect($data)->except('admin')->all());

            if (! empty($data['admin'])) {
                $agency->users()->create([
                    'role_id' => $data['admin']['role_id'] ?? $this->defaultAdminRoleId(),
                    'first_name' => $data['admin']['first_name'],
                    'last_name' => $data['admin']['last_name'],
                    'email' => $data['admin']['email'],
                    'phone' => $data['admin']['phone'] ?? null,
                    'password' => $data['admin']['password'],
                    'is_active' => true,
                ]);
            }

            return $agency;
        });

        return (new PlatformAgencyResource($agency->refresh()->loadCount(['users', 'cars'])->load('currency:id,code,name,symbol,decimals')->load('invoiceTemplate:id,slug,name')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Agency $agency): PlatformAgencyResource
    {
        return new PlatformAgencyResource($agency->loadCount(['users', 'cars'])->load('currency:id,code,name,symbol,decimals')->load('invoiceTemplate:id,slug,name'));
    }

    public function update(UpdateAgencyRequest $request, Agency $agency): PlatformAgencyResource
    {
        $agency->update($request->validated());

        return new PlatformAgencyResource($agency->loadCount(['users', 'cars'])->load('currency:id,code,name,symbol,decimals')->load('invoiceTemplate:id,slug,name'));
    }

    /**
     * Fallback role for an agency's first administrator when the caller did
     * not pick one explicitly.
     */
    private function defaultAdminRoleId(): int
    {
        $roleId = Role::query()->where('name', 'admin')->value('id');

        if ($roleId === null) {
            throw ValidationException::withMessages([
                'admin.role_id' => 'No default admin role exists; pass admin.role_id explicitly.',
            ]);
        }

        return (int) $roleId;
    }
}
