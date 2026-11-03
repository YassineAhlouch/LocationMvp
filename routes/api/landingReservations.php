<?php

use App\Http\Controllers\Api\V1\LandingReservationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Landing reservations — /api/v1/landing-reservations
|--------------------------------------------------------------------------
| The lead pipeline behind the public QR landing (`/api/v1/landing/*`):
| staff list and follow up the requests customers left there. Not a public
| route — it rides the authenticated api.php group, so agency scoping and
| the permission gate apply.
*/

Route::get('landing-reservations', [LandingReservationController::class, 'index'])
    ->middleware('permission:reservations.view')
    ->name('landing-reservations.index');

Route::put('landing-reservations/{landing_reservation}/status', [LandingReservationController::class, 'updateStatus'])
    ->middleware('permission:reservations.update')
    ->name('landing-reservations.status');
