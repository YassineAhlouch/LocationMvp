<?php

namespace App\Providers;

use App\Support\Tenancy\AgencyContext;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AgencyContext::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // API-only app: resources serialize unwrapped ({...} not {data: {...}})
        // so every endpoint has one consistent response shape.
        JsonResource::withoutWrapping();

        RateLimiter::for('api', function (Request $request) {
            // Keyed per token when present: throttling runs before auth:sanctum,
            // so the bearer token is the earliest stable identity available.
            // Without a token (login attempts), fall back to the IP.
            $token = $request->bearerToken();

            $key = $token !== null ? 'token:'.sha1($token) : 'ip:'.$request->ip();

            return Limit::perMinute(120)->by($key);
        });
    }
}
