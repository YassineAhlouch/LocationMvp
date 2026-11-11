<?php

namespace App\Services\Cars;

use App\Models\Car;
use App\Services\Notifications\NotificationDispatcher;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * Fleet document sweep: a car whose insurance or technical inspection falls
 * inside the warning window (config('alerts.expiry_days')) raises an alert to
 * the agency's fleet.update holders. Stages — expiring, urgent
 * (config('alerts.urgent_days')), expired — keep the reminder alive while the
 * dispatcher's per-stage dedupe keeps it from becoming spam.
 *
 * Two entry points share the logic: the scheduled command (all agencies) and
 * a cached lazy sweep (one agency) triggered whenever someone polls their
 * inbox badge — so alerts appear even where no cron is configured.
 */
class CarExpirySweeper
{
    private const CACHE_TTL_MINUTES = 15;

    public function __construct(private readonly NotificationDispatcher $notifications) {}

    /**
     * Sweep every agency (or just one), returning the number of alert rows
     * written.
     */
    public function sweep(?int $agencyId = null): int
    {
        $window = (int) config('alerts.expiry_days', 30);
        $urgent = (int) config('alerts.urgent_days', 7);

        return $this->sweepDocument('insurance_expiry_date', $agencyId, $window, $urgent, $this->notifications->carInsuranceExpiring(...))
            + $this->sweepDocument('technical_inspection_expiry', $agencyId, $window, $urgent, $this->notifications->carInspectionExpiring(...));
    }

    /**
     * At most one sweep per agency per cache window: the badge endpoint is
     * polled every 30 seconds, but the underlying document dates move at
     * calendar speed.
     */
    public function sweepCached(int $agencyId): int
    {
        return (int) Cache::remember(
            "fleet-alerts:swept:{$agencyId}",
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn () => $this->sweep($agencyId),
        );
    }

    /**
     * @param  callable(Car, Carbon, int, string): int  $alert
     */
    private function sweepDocument(string $column, ?int $agencyId, int $window, int $urgent, callable $alert): int
    {
        $sent = 0;

        Car::query()
            ->when($agencyId !== null, fn ($query) => $query->where('agency_id', $agencyId))
            ->whereNotNull($column)
            ->whereDate($column, '<=', today()->addDays($window))
            ->with(['brand', 'model'])
            ->chunkById(200, function ($cars) use (&$sent, $column, $alert, $urgent) {
                foreach ($cars as $car) {
                    $expiry = $car->{$column};

                    $daysLeft = (int) today()->startOfDay()->diffInDays($expiry->startOfDay(), false);

                    $stage = match (true) {
                        $daysLeft < 0 => 'expired',
                        $daysLeft <= $urgent => 'urgent',
                        default => 'expiring',
                    };

                    $sent += $alert($car, $expiry, $daysLeft, $stage);
                }
            });

        return $sent;
    }
}
