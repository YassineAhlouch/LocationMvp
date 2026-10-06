<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\AgencyContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyAgencyScope
{
    /**
     * Resolves the agency for this request and publishes it to AgencyContext,
     * which backs the BelongsToAgency global scope. Must run after auth:sanctum.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $agencyId = $request->user()?->getAttribute('agency_id');

        app(AgencyContext::class)->set($agencyId !== null ? (int) $agencyId : null);

        return $next($request);
    }

    /**
     * Clears the singleton so a long-lived worker (Octane) cannot leak the
     * agency of a previous request into a later unauthenticated one.
     */
    public function terminate(Request $request, Response $response): void
    {
        app(AgencyContext::class)->clear();
    }
}
