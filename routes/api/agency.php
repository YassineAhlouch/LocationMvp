<?php

use App\Http\Controllers\Api\V1\AgencyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Agency — /api/v1/agency
|--------------------------------------------------------------------------
| The authenticated user's own agency. Reading is deliberately not
| permission-gated: the letterhead/document fields (ICE, logo, address) are
| needed by every signed-in user when printing a rental contract. Updating
| the invoice layout is gated behind the settings.manage permission.
*/

Route::get('agency', [AgencyController::class, 'show'])->name('agency.show');

Route::patch('agency', [AgencyController::class, 'update'])
    ->middleware('permission:settings.manage')
    ->name('agency.update');
