<?php

use App\Http\Controllers\Api\V1\ExpenseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Car expenses — /api/v1/expenses
|--------------------------------------------------------------------------
| Agency-scoped money-out ledger (insurance, maintenance, repairs, taxes...).
| No delete endpoint — the catalog has view/create/update only, so the
| ledger is never silently rewritten; corrections are audited updates.
| 'overdue' is derived (pending + due date passed), never stored.
*/

Route::get('expenses', [ExpenseController::class, 'index'])
    ->middleware('permission:expenses.view')
    ->name('expenses.index');

Route::post('expenses', [ExpenseController::class, 'store'])
    ->middleware('permission:expenses.create')
    ->name('expenses.store');

Route::get('expenses/{expense}', [ExpenseController::class, 'show'])
    ->middleware('permission:expenses.view')
    ->name('expenses.show');

Route::patch('expenses/{expense}', [ExpenseController::class, 'update'])
    ->middleware('permission:expenses.update')
    ->name('expenses.update');
