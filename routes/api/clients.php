<?php

use App\Http\Controllers\Api\V1\ClientController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Clients — /api/v1/clients
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). Every route carries its own
| permission gate; {client} binding excludes both foreign and soft-deleted
| rows (agency scope + SoftDeletes).
*/

Route::get('clients', [ClientController::class, 'index'])
    ->middleware('permission:clients.view')
    ->name('clients.index');

Route::post('clients', [ClientController::class, 'store'])
    ->middleware('permission:clients.create')
    ->name('clients.store');

Route::get('clients/{client}', [ClientController::class, 'show'])
    ->middleware('permission:clients.view')
    ->name('clients.show');

Route::patch('clients/{client}', [ClientController::class, 'update'])
    ->middleware('permission:clients.update')
    ->name('clients.update');

Route::delete('clients/{client}', [ClientController::class, 'destroy'])
    ->middleware('permission:clients.delete')
    ->name('clients.destroy');
