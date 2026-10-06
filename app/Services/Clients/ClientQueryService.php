<?php

namespace App\Services\Clients;

use App\Enums\ClientSource;
use App\Enums\ClientStatus;
use App\Models\Client;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Read side of the client module: search, filters, stable ordering.
 * Bookings count (primary-client reservations only) rides along on the page.
 * The agency global scope applies automatically (BelongsToAgency).
 */
class ClientQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexClientRequest.
     */
    private const SORTABLE = [
        'created_at',
        'last_name',
        'phone',
        'last_reservation_at',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     status?: string,
     *     source?: string,
     *     is_active?: bool,
     *     city?: string,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Client::query()
            ->withCount(['reservations as bookings_count'])
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->search($term))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', ClientStatus::from($status)))
            ->when($filters['source'] ?? null, fn ($query, $source) => $query->where('source', ClientSource::from($source)))
            // NB: array_key_exists, not `when($value)` — `is_active=false` is a
            // legitimate filter and when(false, ...) would silently skip it.
            ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
            ->when($filters['city'] ?? null, fn ($query, $city) => $query->where('city', $city))
            ->orderBy(self::sortBy($filters['sort_by'] ?? null), self::sortDir($filters['sort_dir'] ?? null))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    private static function sortBy(?string $value): string
    {
        return in_array($value, self::SORTABLE, true) ? $value : 'created_at';
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }
}
