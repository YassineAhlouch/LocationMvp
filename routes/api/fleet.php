<?php

use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CarCategoryController;
use App\Http\Controllers\Api\V1\CarModelController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Fleet catalog — /api/v1/fleet
|--------------------------------------------------------------------------
| Brands, models and categories are shared reference data (no agency scope):
| every agency rents Dacia Dusters out of the same catalog. Deletes are
| guarded with 409 codes when cars reference them — retire quietly, never
| orphan a car.
*/

// Brands.
Route::get('fleet/brands', [BrandController::class, 'index'])
    ->middleware('permission:fleet.view')
    ->name('fleet.brands.index');

Route::post('fleet/brands', [BrandController::class, 'store'])
    ->middleware('permission:fleet.create')
    ->name('fleet.brands.store');

Route::get('fleet/brands/{brand}', [BrandController::class, 'show'])
    ->middleware('permission:fleet.view')
    ->name('fleet.brands.show');

Route::patch('fleet/brands/{brand}', [BrandController::class, 'update'])
    ->middleware('permission:fleet.update')
    ->name('fleet.brands.update');

Route::delete('fleet/brands/{brand}', [BrandController::class, 'destroy'])
    ->middleware('permission:fleet.delete')
    ->name('fleet.brands.destroy');

// Models of one brand — the picker the car form uses.
Route::get('fleet/brands/{brand}/models', [BrandController::class, 'models'])
    ->middleware('permission:fleet.view')
    ->name('fleet.brands.models');

// Models.
Route::get('fleet/models', [CarModelController::class, 'index'])
    ->middleware('permission:fleet.view')
    ->name('fleet.models.index');

Route::post('fleet/models', [CarModelController::class, 'store'])
    ->middleware('permission:fleet.create')
    ->name('fleet.models.store');

Route::get('fleet/models/{car_model}', [CarModelController::class, 'show'])
    ->middleware('permission:fleet.view')
    ->name('fleet.models.show');

Route::patch('fleet/models/{car_model}', [CarModelController::class, 'update'])
    ->middleware('permission:fleet.update')
    ->name('fleet.models.update');

Route::delete('fleet/models/{car_model}', [CarModelController::class, 'destroy'])
    ->middleware('permission:fleet.delete')
    ->name('fleet.models.destroy');

// Categories.
Route::get('fleet/categories', [CarCategoryController::class, 'index'])
    ->middleware('permission:fleet.view')
    ->name('fleet.categories.index');

Route::post('fleet/categories', [CarCategoryController::class, 'store'])
    ->middleware('permission:fleet.create')
    ->name('fleet.categories.store');

Route::get('fleet/categories/{category}', [CarCategoryController::class, 'show'])
    ->middleware('permission:fleet.view')
    ->name('fleet.categories.show');

Route::patch('fleet/categories/{category}', [CarCategoryController::class, 'update'])
    ->middleware('permission:fleet.update')
    ->name('fleet.categories.update');

Route::delete('fleet/categories/{category}', [CarCategoryController::class, 'destroy'])
    ->middleware('permission:fleet.delete')
    ->name('fleet.categories.destroy');
