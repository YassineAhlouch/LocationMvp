<?php

use App\Http\Controllers\Api\V1\ReservationChangeController;
use App\Http\Controllers\Api\V1\ReservationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------|
| Reservations — /api/v1/reservations
|--------------------------------------------------------------------------|
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). Every route carries its own
| permission gate; the availability probe sits before {reservation} so its
| path never collides with model binding.
*/

Route::get('reservations/availability', [ReservationController::class, 'availability'])
    ->middleware('permission:reservations.view')
    ->name('reservations.availability');

Route::get('reservations/calendar', [ReservationController::class, 'calendar'])
    ->middleware('permission:reservations.view')
    ->name('reservations.calendar');

Route::get('reservation-changes', [ReservationChangeController::class, 'index'])
    ->middleware('permission:reservations.view')
    ->name('reservation-changes.index');

Route::get('reservations', [ReservationController::class, 'index'])
    ->middleware('permission:reservations.view')
    ->name('reservations.index');

Route::post('reservations', [ReservationController::class, 'store'])
    ->middleware('permission:reservations.create')
    ->name('reservations.store');

Route::get('reservations/{reservation}', [ReservationController::class, 'show'])
    ->middleware('permission:reservations.view')
    ->name('reservations.show');

Route::get('reservations/{reservation}/changes', [ReservationController::class, 'changes'])
    ->middleware('permission:reservations.view')
    ->name('reservations.changes');

Route::patch('reservations/{reservation}', [ReservationController::class, 'update'])
    ->middleware('permission:reservations.update')
    ->name('reservations.update');

Route::post('reservations/{reservation}/confirm', [ReservationController::class, 'confirm'])
    ->middleware('permission:reservations.confirm')
    ->name('reservations.confirm');

Route::post('reservations/{reservation}/activate', [ReservationController::class, 'activate'])
    ->middleware('permission:reservations.activate')
    ->name('reservations.activate');

Route::post('reservations/{reservation}/complete', [ReservationController::class, 'complete'])
    ->middleware('permission:reservations.complete')
    ->name('reservations.complete');

Route::post('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])
    ->middleware('permission:reservations.cancel')
    ->name('reservations.cancel');

Route::post('reservations/{reservation}/no-show', [ReservationController::class, 'noShow'])
    ->middleware('permission:reservations.update')
    ->name('reservations.no-show');

Route::post('reservations/{reservation}/extend', [ReservationController::class, 'extend'])
    ->middleware('permission:reservations.update')
    ->name('reservations.extend');
