<?php

use App\Http\Controllers\Api\V1\CarController;
use App\Http\Controllers\Api\V1\CarFinancingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Cars — /api/v1/cars
|--------------------------------------------------------------------------
| Agency-scoped (ApplyAgencyScope runs before binding, so foreign and
| soft-deleted cars 404 on {car}). Every route carries its own permission
| gate; lifecycle statuses (reserved/rented) stay engine-owned — CRUD may
| only drive available/maintenance/inactive.
*/

Route::get('cars', [CarController::class, 'index'])
    ->middleware('permission:fleet.view')
    ->name('cars.index');

Route::post('cars', [CarController::class, 'store'])
    ->middleware('permission:fleet.create')
    ->name('cars.store');

Route::get('cars/{car}', [CarController::class, 'show'])
    ->middleware('permission:fleet.view')
    ->name('cars.show');

Route::get('cars/{car}/overview', [CarController::class, 'overview'])
    ->middleware('permission:fleet.view')
    ->name('cars.overview');

Route::get('cars/{car}/history', [CarController::class, 'history'])
    ->middleware('permission:fleet.view')
    ->name('cars.history');

// Financing & profitability — financial data, so gated by the financing
// module (admin/manager/finance) rather than the fleet module.
Route::get('cars/{car}/statistics', [CarFinancingController::class, 'statistics'])
    ->middleware('permission:financing.view')
    ->name('cars.statistics');

Route::post('cars/{car}/financing', [CarFinancingController::class, 'store'])
    ->middleware('permission:financing.manage')
    ->name('cars.financing.store');

Route::patch('cars/{car}/financing', [CarFinancingController::class, 'update'])
    ->middleware('permission:financing.manage')
    ->name('cars.financing.update');

Route::delete('cars/{car}/financing', [CarFinancingController::class, 'destroy'])
    ->middleware('permission:financing.manage')
    ->name('cars.financing.destroy');

Route::post('cars/{car}/installments/{installment}/pay', [CarFinancingController::class, 'payInstallment'])
    ->middleware('permission:financing.manage')
    ->name('cars.installments.pay');

Route::patch('cars/{car}', [CarController::class, 'update'])
    ->middleware('permission:fleet.update')
    ->name('cars.update');

Route::delete('cars/{car}', [CarController::class, 'destroy'])
    ->middleware('permission:fleet.delete')
    ->name('cars.destroy');
