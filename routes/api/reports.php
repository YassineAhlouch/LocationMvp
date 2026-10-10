<?php

use App\Http\Controllers\Api\V1\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Reports — /api/v1/reports
|--------------------------------------------------------------------------
| Deeper analytics reserved for manager/finance/admin (reports.view):
| monthly cash-flow timeline and per-car profitability.
*/

Route::get('reports/timeline', [ReportController::class, 'timeline'])
    ->middleware('permission:reports.view')
    ->name('reports.timeline');

Route::get('reports/cars', [ReportController::class, 'cars'])
    ->middleware('permission:reports.view')
    ->name('reports.cars');

Route::get('reports/clients', [ReportController::class, 'clients'])
    ->middleware('permission:reports.view')
    ->name('reports.clients');
