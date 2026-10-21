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

/*
| Drill-down behind one card: the headline the card shows, the segments and
| series that explain it, and the records underneath. Same permission as the
| dashboard itself — whoever may see the card may open it. An unknown slug is
| rejected by KpiDetailRequest with the usual 422.
*/
Route::get('dashboard/kpi/{metric}', [DashboardController::class, 'kpi'])
    ->middleware('permission:dashboard.view')
    ->name('dashboard.kpi');
