<?php

use App\Http\Controllers\Api\V1\ExtraController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Extras — /api/v1/extras
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). Read-only catalog slice for the
| reservation form pickers; writes are deliberately absent until an admin
| surface exists.
*/

Route::get('extras', [ExtraController::class, 'index'])
    ->middleware('permission:extras.view')
    ->name('extras.index');
