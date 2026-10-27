<?php

use App\Http\Controllers\Api\V1\QrCodeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| QR codes — /api/v1/qr-codes
|--------------------------------------------------------------------------
| Printed posters for the public landing. A saved code owns a slug (from
| its name) that the QR encodes as /r/{slug}, so its advertised fleet can
| be edited without reprinting. Agency-scoped like cars; gated by the
| fleet module, which already owns the fleet it advertises.
*/

Route::get('qr-codes', [QrCodeController::class, 'index'])
    ->middleware('permission:fleet.view')
    ->name('qr_codes.index');

Route::post('qr-codes', [QrCodeController::class, 'store'])
    ->middleware('permission:fleet.create')
    ->name('qr_codes.store');

Route::get('qr-codes/{qrCode}', [QrCodeController::class, 'show'])
    ->middleware('permission:fleet.view')
    ->name('qr_codes.show');

Route::patch('qr-codes/{qrCode}', [QrCodeController::class, 'update'])
    ->middleware('permission:fleet.update')
    ->name('qr_codes.update');

Route::delete('qr-codes/{qrCode}', [QrCodeController::class, 'destroy'])
    ->middleware('permission:fleet.delete')
    ->name('qr_codes.destroy');
