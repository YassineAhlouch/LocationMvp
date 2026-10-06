<?php

namespace App\Services\Users;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Read side of the team module. The agency global scope applies
 * automatically (BelongsToAgency), so a list never leaks a sibling
 * agency's staff. Role and agency are eager loaded because UserResource
 * embeds both — anything less would be an N+1 per row.
 */
class UserQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexUserRequest. 'name' maps
     * to the first/last name pair because there is no single column.
     */
    private const SORTABLE = [
        'created_at',
        'email',
        'last_login_at',
        'name',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     role_id?: int,
     *     is_active?: bool,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->with([
                'role:id,name,permissions,is_active',
                'agency:id,name',
            ])
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

        // 'name' sorts by both columns — spread the resolved pairs in order.
        foreach (self::sortColumns($filters['sort_by'] ?? null, self::sortDir($filters['sort_dir'] ?? null)) as [$column, $direction]) {
            $query->orderBy($column, $direction);
        }

        return $query
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * Returns [$column, $direction] pairs for the whitelisted sort.
     *
     * @return array<int, array{0: string, 1: string}>
     */
    private static function sortColumns(?string $sortBy, string $direction): array
    {
        if ($sortBy === 'name') {
            return [['first_name', $direction], ['last_name', $direction]];
        }

        return [[in_array($sortBy, self::SORTABLE, true) ? $sortBy : 'created_at', $direction]];
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }
}
