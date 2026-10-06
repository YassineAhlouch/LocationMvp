<?php

namespace App\Services\Activity;

use App\Jobs\LogActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Append-only activity trail writer. Call sites decide module, action and
 * actor — the business operation knows these, not row-level CRUD, so no
 * model observers are involved. Request metadata (ip, user agent) and the
 * entity identity are frozen at call time, then the insert is queued and
 * dispatched after the current transaction commits: a failed action rolls
 * back without a trace, a successful one is logged exactly once.
 */
class ActivityLogger
{
    /**
     * @param  string  $module  catalog module, e.g. reservations, payments, pricing, auth
     * @param  string  $action  past-tense event, e.g. created, confirmed, refunded
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public function log(
        string $module,
        string $action,
        Model $entity,
        User $actor,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        // Agency-scoped entities carry their own agency_id; shared catalogs
        // (brands/models/categories) have none, so fall back to the actor's
        // agency — every audit row stays attributable to exactly one agency.
        LogActivity::dispatch([
            'agency_id' => (int) ($entity->getAttribute('agency_id') ?? $actor->agency_id),
            'user_id' => $actor->id,
            'module' => $module,
            'entity_type' => $entity->getMorphClass(),
            'entity_id' => $entity->getKey(),
            'action' => $action,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ])->afterCommit();
    }
}
