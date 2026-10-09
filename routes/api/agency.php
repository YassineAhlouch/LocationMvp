<?php

use App\Http\Controllers\Api\V1\AgencyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Agency — /api/v1/agency
|--------------------------------------------------------------------------
| The authenticated user's own agency. Deliberately not permission-gated:
| the letterhead/document fields (ICE, logo, address) and the assigned
| invoice layout are needed by every signed-in user when printing a rental
| contract. Which layout an agency uses is assigned by an administrator
| through the settings endpoints, never from here.
*/

Route::get('agency', [AgencyController::class, 'show'])->name('agency.show');
