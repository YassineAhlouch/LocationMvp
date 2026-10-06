<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Session routes — /api/v1/auth
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope).
*/

Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');
Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
