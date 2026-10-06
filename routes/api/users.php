<?php

use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Team — /api/v1/users + /api/v1/roles
|--------------------------------------------------------------------------
| Users are agency-scoped (a staff member belongs to exactly one agency);
| roles are global master-data like brands — one catalog every agency reads.
| The catalog has no users.delete / roles.delete: accounts are retired via
| is_active=false and roles are frozen, never destroyed, so nothing that
| reservations, payments or activity rows reference ever vanishes.
*/

// Users.
Route::get('users', [UserController::class, 'index'])
    ->middleware('permission:users.view')
    ->name('users.index');

Route::post('users', [UserController::class, 'store'])
    ->middleware('permission:users.create')
    ->name('users.store');

Route::get('users/{user}', [UserController::class, 'show'])
    ->middleware('permission:users.view')
    ->name('users.show');

Route::patch('users/{user}', [UserController::class, 'update'])
    ->middleware('permission:users.update')
    ->name('users.update');

// Roles.
// Static segment first: "roles/permissions" must never bind as {role}.
Route::get('roles/permissions', [RoleController::class, 'permissions'])
    ->middleware('permission:roles.view')
    ->name('roles.permissions');

Route::get('roles', [RoleController::class, 'index'])
    ->middleware('permission:roles.view')
    ->name('roles.index');

Route::post('roles', [RoleController::class, 'store'])
    ->middleware('permission:roles.manage')
    ->name('roles.store');

Route::get('roles/{role}', [RoleController::class, 'show'])
    ->middleware('permission:roles.view')
    ->name('roles.show');

Route::patch('roles/{role}', [RoleController::class, 'update'])
    ->middleware('permission:roles.manage')
    ->name('roles.update');
