<?php

use App\Http\Controllers\Api\V1\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| In-app notifications — /api/v1/notifications
|--------------------------------------------------------------------------
| Your own inbox (Laravel's database notifications). Feed, badge count,
| mark one/mark all. Every route resolves rows THROUGH the authenticated
| user's notifications relation — a raw id can never touch another user's
| row. POST /notifications composes announcements (notifications.send).
*/

Route::get('notifications', [NotificationController::class, 'index'])
    ->middleware('permission:notifications.view')
    ->name('notifications.index');

Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount'])
    ->middleware('permission:notifications.view')
    ->name('notifications.unread-count');

Route::post('notifications/read-all', [NotificationController::class, 'readAll'])
    ->middleware('permission:notifications.view')
    ->name('notifications.read-all');

Route::post('notifications/read/{notification}', [NotificationController::class, 'read'])
    ->middleware('permission:notifications.view')
    ->name('notifications.read');

Route::post('notifications', [NotificationController::class, 'store'])
    ->middleware('permission:notifications.send')
    ->name('notifications.store');
