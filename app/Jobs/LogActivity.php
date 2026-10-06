<?php

namespace App\Jobs;

use App\Models\ActivityLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Writes one append-only activity row. Queued so audit writes never slow
 * the request path, dispatched afterCommit so a rolled-back action leaves
 * no trace. The payload is plain scalars — nothing on it can go stale
 * except ids, which is exactly what an audit trail should keep.
 */
class LogActivity implements ShouldQueue
{
    use Queueable;

    /**
     * Retry a transient failure (e.g. DB contention) rather than dropping
     * an audit entry on the floor.
     */
    public int $tries = 3;

    /**
     * @param  array<string, mixed>  $payload
     */
    public function __construct(private readonly array $payload) {}

    public function handle(): void
    {
        ActivityLog::create($this->payload);
    }
}
