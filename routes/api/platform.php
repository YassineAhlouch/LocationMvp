<?php

use App\Http\Controllers\Api\V1\Platform\AgencyController;
use App\Http\Controllers\Api\V1\Platform\AuthController;
use App\Http\Controllers\Api\V1\Platform\BrandController;
use App\Http\Controllers\Api\V1\Platform\CarCategoryController;
use App\Http\Controllers\Api\V1\Platform\CarModelController;
use App\Http\Controllers\Api\V1\Platform\CurrencyController;
use App\Http\Controllers\Api\V1\Platform\DashboardController;
use App\Http\Controllers\Api\V1\Platform\InvoiceController;
use App\Http\Controllers\Api\V1\Platform\InvoiceTemplateController;
use App\Http\Controllers\Api\V1\Platform\RoleController;
use App\Http\Controllers\Api\V1\Platform\UserController;
use App\Http\Middleware\EnsurePlatformAdmin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Platform (parent) API — /api/v1/platform
|--------------------------------------------------------------------------
| A self-contained area for the platform dashboard, deliberately outside the
| agency-scoped /api/v1 group: platform admins belong to no agency and must
| see every agency. Tokens are issued by platform/auth/login and every route
| behind EnsurePlatformAdmin rejects ordinary staff tokens. No AgencyContext
| is ever set here, so the BelongsToAgency global scope stays open.
*/

Route::prefix('v1/platform')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:6,1')
        ->name('platform.auth.login');

    Route::middleware(['auth:sanctum', EnsurePlatformAdmin::class])->group(function () {
        Route::get('auth/me', [AuthController::class, 'me'])->name('platform.auth.me');
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('platform.auth.logout');

        // Agencies.
        Route::get('agencies', [AgencyController::class, 'index'])->name('platform.agencies.index');
        Route::post('agencies', [AgencyController::class, 'store'])->name('platform.agencies.store');
        Route::get('agencies/{agency}', [AgencyController::class, 'show'])->name('platform.agencies.show');
        Route::patch('agencies/{agency}', [AgencyController::class, 'update'])->name('platform.agencies.update');

        // Platform dashboard KPIs.
        Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('platform.dashboard.stats');

        // Invoices — every reservation across (or within) an agency.
        Route::get('invoices', [InvoiceController::class, 'index'])->name('platform.invoices.index');

        // Contract/invoice layouts agencies can be assigned.
        Route::get('invoice-templates', [InvoiceTemplateController::class, 'index'])->name('platform.invoice-templates.index');

        // Staff across every agency.
        Route::get('users', [UserController::class, 'index'])->name('platform.users.index');
        Route::post('users', [UserController::class, 'store'])->name('platform.users.store');
        Route::get('users/{user}', [UserController::class, 'show'])->name('platform.users.show');
        Route::patch('users/{user}', [UserController::class, 'update'])->name('platform.users.update');

        // Roles — the catalog staff can be assigned.
        Route::get('roles', [RoleController::class, 'index'])->name('platform.roles.index');

        // Fleet master data (shared across agencies).
        Route::get('fleet/brands', [BrandController::class, 'index'])->name('platform.fleet.brands.index');
        Route::post('fleet/brands', [BrandController::class, 'store'])->name('platform.fleet.brands.store');
        Route::get('fleet/brands/{brand}', [BrandController::class, 'show'])->name('platform.fleet.brands.show');
        Route::patch('fleet/brands/{brand}', [BrandController::class, 'update'])->name('platform.fleet.brands.update');
        Route::delete('fleet/brands/{brand}', [BrandController::class, 'destroy'])->name('platform.fleet.brands.destroy');

        Route::get('fleet/models', [CarModelController::class, 'index'])->name('platform.fleet.models.index');
        Route::post('fleet/models', [CarModelController::class, 'store'])->name('platform.fleet.models.store');
        Route::get('fleet/models/{car_model}', [CarModelController::class, 'show'])->name('platform.fleet.models.show');
        Route::patch('fleet/models/{car_model}', [CarModelController::class, 'update'])->name('platform.fleet.models.update');
        Route::delete('fleet/models/{car_model}', [CarModelController::class, 'destroy'])->name('platform.fleet.models.destroy');

        Route::get('fleet/categories', [CarCategoryController::class, 'index'])->name('platform.fleet.categories.index');
        Route::post('fleet/categories', [CarCategoryController::class, 'store'])->name('platform.fleet.categories.store');
        Route::get('fleet/categories/{category}', [CarCategoryController::class, 'show'])->name('platform.fleet.categories.show');
        Route::patch('fleet/categories/{category}', [CarCategoryController::class, 'update'])->name('platform.fleet.categories.update');
        Route::delete('fleet/categories/{category}', [CarCategoryController::class, 'destroy'])->name('platform.fleet.categories.destroy');

        // Currencies — the units agencies price and invoice in.
        Route::get('fleet/currencies', [CurrencyController::class, 'index'])->name('platform.fleet.currencies.index');
        Route::post('fleet/currencies', [CurrencyController::class, 'store'])->name('platform.fleet.currencies.store');
        Route::get('fleet/currencies/{currency}', [CurrencyController::class, 'show'])->name('platform.fleet.currencies.show');
        Route::patch('fleet/currencies/{currency}', [CurrencyController::class, 'update'])->name('platform.fleet.currencies.update');
        Route::delete('fleet/currencies/{currency}', [CurrencyController::class, 'destroy'])->name('platform.fleet.currencies.destroy');
    });
});
