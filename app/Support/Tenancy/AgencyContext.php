<?php

namespace App\Support\Tenancy;

/**
 * Holds the agency id for the current execution context.
 *
 * Explicit by design: the ApplyAgencyScope middleware sets it right after
 * authentication, and queue jobs / console commands use with(). It never
 * falls back to auth() — that would recurse while the guard resolves the
 * user through the agency-scoped query.
 */
class AgencyContext
{
    private ?int $agencyId = null;

    public function set(?int $agencyId): void
    {
        $this->agencyId = $agencyId;
    }

    public function id(): ?int
    {
        return $this->agencyId;
    }

    /**
     * Run $callback with a specific agency context, restoring the previous one after.
     *
     * @template TReturn
     *
     * @param  callable(): TReturn  $callback
     * @return TReturn
     */
    public function with(int $agencyId, callable $callback): mixed
    {
        $previous = $this->agencyId;
        $this->agencyId = $agencyId;

        try {
            return $callback();
        } finally {
            $this->agencyId = $previous;
        }
    }

    public function clear(): void
    {
        $this->agencyId = null;
    }
}
