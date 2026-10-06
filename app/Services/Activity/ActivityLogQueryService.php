<?php

namespace App\Services\Activity;

use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

/**
 * Read side of the activity trail: exact-match filters over the
 * append-only log, newest first. The agency global scope applies
 * automatically (BelongsToAgency), so this service can never leak another
 * agency's rows.
 */
class ActivityLogQueryService
{
    /**
     * @param  array{
     *     module?: string,
     *     action?: string,
     *     user_id?: int,
     *     entity_type?: string,
     *     entity_id?: int,
     *     from?: string,
     *     to?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return ActivityLog::query()
            ->with('user:id,first_name,last_name')
            ->when($filters['module'] ?? null, fn ($query, $module) => $query->where('module', $module))
            ->when($filters['action'] ?? null, fn ($query, $action) => $query->where('action', $action))
            ->when($filters['user_id'] ?? null, fn ($query, $userId) => $query->where('user_id', $userId))
            ->when($filters['entity_type'] ?? null, fn ($query, $type) => $query->where('entity_type', $type))
            ->when($filters['entity_id'] ?? null, fn ($query, $entityId) => $query->where('entity_id', $entityId))
            ->when($filters['from'] ?? null, fn ($query, $from) => $query->where('created_at', '>=', Carbon::parse($from)))
            ->when($filters['to'] ?? null, fn ($query, $to) => $query->where('created_at', '<=', self::endOfBoundary($to)))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * A date-only upper bound ("2026-10-06") includes that whole day; a
     * full datetime is honoured as given.
     */
    private static function endOfBoundary(string $value): Carbon
    {
        $parsed = Carbon::parse($value);

        return $parsed->toDateString() === $value ? $parsed->endOfDay() : $parsed;
    }
}
