<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public auth routes — /api/v1/auth
|--------------------------------------------------------------------------
| Login is throttled per IP: 6 attempts/minute (middleware 'throttle:6,1'),
| on top of the global api limiter.
*/

Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:6,1')
        ->name('auth.login');
});
