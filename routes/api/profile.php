<?php

use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Profile — /api/v1/profile
|--------------------------------------------------------------------------
| Self-service account settings: every signed-in staff member reads and edits
| their own details, avatar and password. Deliberately not permission-gated —
| the controller always works on the authenticated user, so the actor can
| only ever change their own record.
*/

Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');

Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');

Route::patch('profile/password', [ProfileController::class, 'updatePassword'])
    ->name('profile.password.update');

Route::post('profile/avatar', [ProfileController::class, 'updateAvatar'])
    ->name('profile.avatar.update');
