<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\SummaryDashboardRequest;
use App\Services\Reports\ReportingService;
use Carbon\CarbonInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function __construct(private readonly ReportingService $reporting) {}

    /**
     * At-a-glance KPIs for the current calendar month (or a given window):
     * money in, money out, net, reservation and fleet position, occupancy.
     * Read-only — no audit rows are written for reads.
     */
    public function summary(SummaryDashboardRequest $request): JsonResponse
    {
        $period = $this->period($request);

        return response()->json($this->reporting->summary($period['from'], $period['to']));
    }

    /**
     * Defaults to the current calendar month — the natural home view.
     *
     * @return array{from: CarbonInterface, to: CarbonInterface}
     */
    private function period(SummaryDashboardRequest $request): array
    {
        $from = $request->has('from')
            ? Carbon::parse($request->string('from'))
            : today()->startOfMonth();

        $to = $request->has('to')
            ? Carbon::parse($request->string('to'))
            : today();

        return ['from' => $from, 'to' => $to];
    }
}
