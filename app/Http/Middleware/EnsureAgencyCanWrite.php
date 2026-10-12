<?php

namespace App\Http\Middleware;

use App\Exceptions\Domain\AgencyPaymentRequiredException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAgencyCanWrite
{
    /**
     * Keeps an agency whose subscription is overdue in read-only mode: every
     * state-changing request is rejected with a 402 (payment_required) until
     * the balance is settled. Safe reads — and signing out — stay available so
     * the workspace, its data and the "please pay" banner remain reachable.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe() || $request->routeIs('auth.logout')) {
            return $next($request);
        }

        $agency = $request->user()?->agency;

        if ($agency !== null && $agency->hasOverduePayment()) {
            throw new AgencyPaymentRequiredException;
        }

        return $next($request);
    }
}
