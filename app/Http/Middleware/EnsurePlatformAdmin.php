<?php

namespace App\Http\Middleware;

use App\Exceptions\AccountDisabledException;
use App\Models\PlatformAdmin;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards the /api/v1/platform area.
 *
 * Sanctum tokens are polymorphic, so a normal staff token would otherwise
 * satisfy auth:sanctum here. This rejects it: only PlatformAdmin tokens may
 * reach platform routes, and a deactivated platform admin is shut out
 * immediately even with a still-valid token.
 */
class EnsurePlatformAdmin
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = $request->user();

        if (! $admin instanceof PlatformAdmin) {
            throw new AuthenticationException;
        }

        if (! $admin->is_active) {
            throw new AccountDisabledException;
        }

        return $next($request);
    }
}
