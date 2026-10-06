<?php

use App\Http\Controllers\Api\V1\ActivityLogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Activity trail — /api/v1/activity-logs
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). Read-only, append-only: the feed
| exposes the queued audit entries with exact-match filters, newest first.
*/

Route::get('activity-logs', [ActivityLogController::class, 'index'])
    ->middleware('permission:activity_logs.view')
    ->name('activity-logs.index');

Route::get('activity-logs/{activity_log}', [ActivityLogController::class, 'show'])
    ->middleware('permission:activity_logs.view')
    ->name('activity-logs.show');
