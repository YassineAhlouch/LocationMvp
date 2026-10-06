<?php

namespace App\Models\Concerns;

use App\Models\Agency;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Applies agency scoping: every query is filtered by the current agency and
 * every created row inherits the agency id automatically.
 *
 * Models carrying their own agency_id only: User, Client, Car, Reservation,
 * Payment, CarExpense, ActivityLog, Extra. Children scoped through their
 * parent (reservation_extras, car_images, ...) must not use this trait.
 */
trait BelongsToAgency
{
    public static function bootBelongsToAgency(): void
    {
        static::addGlobalScope('agency', function (Builder $builder): void {
            $agencyId = app(AgencyContext::class)->id();

            if ($agencyId !== null) {
                $builder->where($builder->getModel()->getTable().'.agency_id', $agencyId);
            }
        });

        static::creating(function (self $model): void {
            if ($model->getAttribute('agency_id') === null) {
                $model->setAttribute('agency_id', app(AgencyContext::class)->id());
            }
        });
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
