<?php

use App\Http\Controllers\Api\V1\LandingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public landing (QR) routes — /api/v1/landing
|--------------------------------------------------------------------------
| Consumed by the public landing page that printed QR codes open — no
| authentication, agency resolved from the advertised car. Generous GET (a
| landing may refetch on each scan) and tight POST (lead creation).
*/

Route::prefix('v1')->group(function () {
    Route::get('landing/cars', [LandingController::class, 'cars'])
        ->middleware('throttle:60,1')
        ->name('landing.cars');

    Route::post('landing/reservations', [LandingController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('landing.reservations.store');
});
