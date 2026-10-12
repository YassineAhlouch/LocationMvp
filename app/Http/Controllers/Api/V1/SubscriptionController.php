<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AgencyPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The signed-in agency's billing standing plus its recent platform invoices.
 * Drives the "please pay" banner and the read-only notice in the workspace.
 * Read-only and not permission-gated: every staff member needs to know why
 * the account is locked.
 */
class SubscriptionController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $agency = $request->user()->agency;

        abort_if($agency === null, 404, 'No agency is associated with this account.');

        $invoices = $agency->agencyPayments()
            ->with('currency:id,code,symbol,decimals')
            ->orderByDesc('due_date')
            ->limit(24)
            ->get();

        $currency = $agency->currency ?? $invoices->first()?->currency;

        return response()->json([
            'locked' => $agency->hasOverduePayment(),
            'outstanding_amount' => $agency->outstandingAmount(),
            'currency' => $currency === null ? null : [
                'code' => $currency->code,
                'symbol' => $currency->symbol,
                'decimals' => $currency->decimals,
            ],
            'next_due_date' => $agency->nextDueDate(),
            'invoices' => $invoices->map(fn (AgencyPayment $payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'period' => $payment->period,
                'due_date' => $payment->due_date?->toDateString(),
                'paid_at' => $payment->paid_at?->toIso8601String(),
                'status' => $payment->status(),
                'reference' => $payment->reference,
            ])->all(),
        ]);
    }
}
