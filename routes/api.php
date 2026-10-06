<?php

use App\Http\Middleware\ApplyAgencyScope;
use App\Http\Middleware\EnsureActiveAccount;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API routes
|--------------------------------------------------------------------------
| Self-contained: declares its own prefix and throttling, no group context.
*/

require __DIR__.'/api/auth.php';

/*
|--------------------------------------------------------------------------
| Authenticated API — /api/v1
|--------------------------------------------------------------------------
| Every module file required below inherits: version prefix, token auth,
| active-account enforcement and agency scoping. Rate limiting (throttle:api)
| comes from the framework's api middleware group, enabled in bootstrap.
*/

Route::prefix('v1')
    ->middleware([
        'auth:sanctum',
        EnsureActiveAccount::class,
        ApplyAgencyScope::class,
    ])
    ->group(function () {
        require __DIR__.'/api/session.php';
        require __DIR__.'/api/reservations.php';
        require __DIR__.'/api/pricing.php';
        require __DIR__.'/api/payments.php';
        require __DIR__.'/api/activity.php';
        require __DIR__.'/api/clients.php';
        require __DIR__.'/api/cars.php';
        require __DIR__.'/api/fleet.php';
        require __DIR__.'/api/users.php';
        require __DIR__.'/api/expenses.php';
        require __DIR__.'/api/dashboard.php';
        require __DIR__.'/api/reports.php';
        require __DIR__.'/api/notifications.php';
    });
