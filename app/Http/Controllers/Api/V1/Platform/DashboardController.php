<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Enums\PaymentRecordStatus;
use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\AgencyPayment;
use App\Models\Car;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

/**
 * Platform-wide KPIs: tenant count and fleet/pipeline positions. Read-only —
 * no audit rows are written for reads, matching the agency DashboardController.
 */
class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $monthStart = Carbon::now()->startOfMonth();

        $revenue = (float) Payment::query()
            ->where('status', PaymentRecordStatus::Paid)
            ->where('payment_date', '>=', $monthStart)
            ->sum('amount');

        return response()->json([
            'agencies' => [
                'total' => Agency::query()->count(),
                'active' => Agency::query()->where('is_active', true)->count(),
                'inactive' => Agency::query()->where('is_active', false)->count(),
            ],
            'billing' => [
                'outstanding_total' => (float) AgencyPayment::query()->whereNull('paid_at')->sum('amount'),
                'overdue_agencies' => Agency::query()->whereHas(
                    'agencyPayments',
                    fn ($query) => $query->whereNull('paid_at')->whereDate('due_date', '<', today()),
                )->count(),
                'collected_this_month' => $revenue,
            ],
            'users' => User::query()->count(),
            'cars' => Car::query()->count(),
            'clients' => Client::query()->count(),
            'reservations' => Reservation::query()->count(),
            'monthly_revenue' => $revenue,
            'recent_agencies' => Agency::query()
                ->withCount(['users', 'cars'])
                ->with('currency:id,code,symbol,name')
                ->latest('id')
                ->limit(5)
                ->get()
                ->map(fn (Agency $agency) => [
                    'id' => $agency->id,
                    'name' => $agency->name,
                    'city' => $agency->city,
                    'is_active' => $agency->is_active,
                    'users_count' => $agency->users_count,
                    'cars_count' => $agency->cars_count,
                    'currency' => $agency->currency !== null ? [
                        'id' => $agency->currency->id,
                        'code' => $agency->currency->code,
                        'symbol' => $agency->currency->symbol,
                    ] : null,
                    'created_at' => $agency->created_at?->toIso8601String(),
                ]),
        ]);
    }
}
