<?php

use App\Http\Controllers\Api\V1\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Payments — /api/v1
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). The ledger lifecycle:
| pending → paid (confirm) → refunded (refund); only pending rows are
| deletable. Read and write verbs carry their own permission gates.
*/

// Agency-wide ledger + analytics (payments page).
Route::get('payments', [PaymentController::class, 'ledger'])
    ->middleware('permission:payments.view')
    ->name('payments.ledger');

Route::get('payments/overview', [PaymentController::class, 'overview'])
    ->middleware('permission:payments.view')
    ->name('payments.overview');

Route::get('reservations/{reservation}/payments', [PaymentController::class, 'index'])
    ->middleware('permission:payments.view')
    ->name('payments.index');

Route::post('reservations/{reservation}/payments', [PaymentController::class, 'store'])
    ->middleware('permission:payments.create')
    ->name('payments.store');

Route::delete('reservations/{reservation}/payments/{payment}', [PaymentController::class, 'destroy'])
    ->middleware('permission:payments.create')
    ->name('payments.destroy');

Route::post('payments/{payment}/confirm', [PaymentController::class, 'confirm'])
    ->middleware('permission:payments.create')
    ->name('payments.confirm');

Route::post('payments/{payment}/refund', [PaymentController::class, 'refund'])
    ->middleware('permission:payments.refund')
    ->name('payments.refund');
