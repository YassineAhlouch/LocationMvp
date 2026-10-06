<?php

namespace App\Http\Middleware;

use App\Exceptions\PermissionDeniedException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Route-level permission gate: ->middleware('permission:reservations.create').
     *
     * Reads the role from the database (not token abilities) so revoking a
     * permission takes effect immediately, without forcing re-login.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->hasPermission($permission)) {
            throw new PermissionDeniedException($permission);
        }

        return $next($request);
    }
}
