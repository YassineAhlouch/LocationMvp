<?php

use App\Http\Controllers\Api\V1\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Uploads — /api/v1/uploads
|--------------------------------------------------------------------------
| Accepts one image file and returns its public URL. No domain tables are
| touched, so the agency global scope has nothing to apply here — the
| caller (car gallery) persists the returned path on its own row.
*/

Route::post('uploads', [UploadController::class, 'store'])
    ->middleware('permission:fleet.update')
    ->name('uploads.store');
