<?php

namespace App\Console\Commands;

use App\Services\Cars\CarExpirySweeper;
use Illuminate\Console\Command;

/**
 * Daily cron entry for the fleet document sweep. The same logic also runs
 * lazily (and cached) whenever an inbox badge is polled, so a deployment
 * without a working scheduler still raises the alerts.
 */
class FleetExpiryAlerts extends Command
{
    protected $signature = 'fleet:expiry-alerts';

    protected $description = 'Alert fleet managers about insurance and technical-inspection expiry dates';

    public function __construct(private readonly CarExpirySweeper $sweeper)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $dispatched = $this->sweeper->sweep();

        $this->info("{$dispatched} expiry alert(s) dispatched.");

        return self::SUCCESS;
    }
}
