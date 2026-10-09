<?php

use App\Http\Controllers\Api\V1\AgencyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Agency — /api/v1/agency
|--------------------------------------------------------------------------
| Read-only view of the authenticated user's own agency. Deliberately not
| permission-gated: the letterhead/document fields (ICE, logo, address) are
| needed by every signed-in user when printing a rental contract.
*/

Route::get('agency', [AgencyController::class, 'show'])->name('agency.show');
