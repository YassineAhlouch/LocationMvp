<?php

namespace App\Services\Activity;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Uniform one-line audit call for actions and controllers. Resolves the
 * logger from the container so composed traits (which have no constructor)
 * can log too — every audit entry in the app goes through this one door.
 */
trait LogsActivity
{
    /**
     * @param  string  $module  catalog module, e.g. reservations, payments, pricing, auth
     * @param  string  $action  past-tense event, e.g. created, confirmed, refunded
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    protected function logActivity(
        string $module,
        string $action,
        Model $entity,
        User $actor,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        app(ActivityLogger::class)->log(
            $module,
            $action,
            $entity,
            $actor,
            $description,
            $oldValues,
            $newValues,
        );
    }
}
