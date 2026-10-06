<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\CarsReportRequest;
use App\Http\Requests\Reports\TimelineReportRequest;
use App\Services\Reports\ReportingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function __construct(private readonly ReportingService $reporting) {}

    /**
     * Monthly revenue vs. expenses, oldest → newest, zero-filled — the
     * cash-flow chart. Read-only: no audit rows for reads.
     */
    public function timeline(TimelineReportRequest $request): JsonResponse
    {
        $months = (int) $request->input('months', 6);

        return response()->json($this->reporting->timeline(max(1, min(12, $months))));
    }

    /**
     * Per-car profitability for the period, ranked by margin.
     */
    public function cars(CarsReportRequest $request): JsonResponse
    {
        $from = $request->has('from')
            ? Carbon::parse($request->string('from'))
            : today()->startOfMonth();

        $to = $request->has('to')
            ? Carbon::parse($request->string('to'))
            : today();

        return response()->json($this->reporting->cars($from, $to));
    }
}
