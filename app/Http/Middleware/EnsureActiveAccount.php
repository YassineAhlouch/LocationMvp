<?php

namespace App\Http\Middleware;

use App\Exceptions\AccountDisabledException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveAccount
{
    /**
     * Rejects tokens belonging to deactivated staff. Without this, a fired
     * employee's token would stay valid until expiry — login only checks
     * is_active once, at issuance.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && ! $user->is_active) {
            throw new AccountDisabledException;
        }

        return $next($request);
    }
}
