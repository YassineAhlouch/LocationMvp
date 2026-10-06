<?php

use App\Http\Controllers\Api\V1\PricingController;
use App\Http\Controllers\Api\V1\PricingRuleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Pricing — /api/v1/pricing
|--------------------------------------------------------------------------
| Requires the authenticated group from routes/api.php (auth:sanctum,
| EnsureActiveAccount, ApplyAgencyScope). The quote probe is gated by
| reservations.create — it is the booking form's calculator — while rule
| management carries the dedicated pricing module verbs.
*/

Route::post('pricing/quote', [PricingController::class, 'quote'])
    ->middleware('permission:reservations.create')
    ->name('pricing.quote');

Route::get('pricing/rules', [PricingRuleController::class, 'index'])
    ->middleware('permission:pricing.view')
    ->name('pricing.rules.index');

Route::post('pricing/rules', [PricingRuleController::class, 'store'])
    ->middleware('permission:pricing.manage')
    ->name('pricing.rules.store');

Route::get('pricing/rules/{pricing_rule}', [PricingRuleController::class, 'show'])
    ->middleware('permission:pricing.view')
    ->name('pricing.rules.show');

Route::patch('pricing/rules/{pricing_rule}', [PricingRuleController::class, 'update'])
    ->middleware('permission:pricing.manage')
    ->name('pricing.rules.update');

Route::delete('pricing/rules/{pricing_rule}', [PricingRuleController::class, 'destroy'])
    ->middleware('permission:pricing.manage')
    ->name('pricing.rules.destroy');
