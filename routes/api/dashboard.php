<?php

use App\Http\Controllers\Api\V1\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Dashboard — /api/v1/dashboard
|--------------------------------------------------------------------------
| At-a-glance KPIs: money in/out, net, reservation and fleet position,
| occupancy. Read-only; every agent carries dashboard.view but deeper
| analytics live under /reports (reports.view).
*/

Route::get('dashboard/summary', [DashboardController::class, 'summary'])
    ->middleware('permission:dashboard.view')
    ->name('dashboard.summary');
