<?php

use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('tasks/groups', [TaskController::class, 'groups'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.groups');

Route::post('tasks/groups', [TaskController::class, 'storeGroup'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.groups.store');

Route::patch('tasks/groups/{group}', [TaskController::class, 'updateGroup'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.groups.update');

Route::delete('tasks/groups/{group}', [TaskController::class, 'destroyGroup'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.groups.destroy');

Route::get('tasks', [TaskController::class, 'index'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.index');

Route::post('tasks', [TaskController::class, 'store'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.store');

Route::get('tasks/{task}', [TaskController::class, 'show'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.show');

Route::patch('tasks/{task}', [TaskController::class, 'update'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.update');

Route::delete('tasks/{task}', [TaskController::class, 'destroy'])
    ->middleware('permission:dashboard.view')
    ->name('tasks.destroy');
