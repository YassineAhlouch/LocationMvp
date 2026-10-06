<?php

use App\Exceptions\AccountDisabledException;
use App\Exceptions\Domain\DomainException;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\PermissionDeniedException;
use App\Http\Middleware\ApplyAgencyScope;
use App\Http\Middleware\EnsurePermission;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Global API rate limit (throttle:api), defined in AppServiceProvider.
        $middleware->throttleApi();

        $middleware->alias([
            'permission' => EnsurePermission::class,
        ]);

        // Route-model binding resolves in the api group, before route-level
        // middleware. AgencyContext must be set before SubstituteBindings runs,
        // otherwise BelongsToAgency no-ops and binding could leak another
        // agency's row (cross-tenant 200 instead of 404).
        $middleware->prependToPriorityList(
            SubstituteBindings::class,
            ApplyAgencyScope::class,
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Stable machine-readable codes so the React client can branch on
        // `code` instead of matching human-readable messages.
        $exceptions->render(function (DomainException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(
                    array_merge(['message' => $e->getMessage(), 'code' => $e->errorCode()], $e->context()),
                    $e->httpStatus(),
                );
            }
        });

        $exceptions->render(function (PermissionDeniedException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'code' => 'forbidden',
                    'permission' => $e->permission,
                ], 403);
            }
        });

        $exceptions->render(function (AccountDisabledException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'code' => 'account_disabled',
                ], 403);
            }
        });

        $exceptions->render(function (InvalidCredentialsException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'code' => 'invalid_credentials',
                ], 401);
            }
        });
    })->create();
