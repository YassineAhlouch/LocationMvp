<?php

use App\Http\Controllers\Api\V1\SettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Settings — /api/v1/invoice-templates + /api/v1/agencies
|--------------------------------------------------------------------------
| Administrative catalog and assignment endpoints. Gated behind
| settings.manage (admin only): which invoice layout each agency prints is a
| decision made for the agency, not by the agency. Agencies are the tenant
| root, so listing them here legitimately spans every agency.
*/

Route::middleware('permission:settings.manage')->group(function () {
    Route::get('invoice-templates', [SettingsController::class, 'invoiceTemplates'])
        ->name('invoice-templates.index');

    Route::get('agencies', [SettingsController::class, 'agencies'])
        ->name('agencies.index');

    Route::patch('agencies/{agency}', [SettingsController::class, 'updateAgencyTemplate'])
        ->name('agencies.update-template');
});
