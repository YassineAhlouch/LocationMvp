<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\KpiMetric;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reports\KpiDetailRequest;
use App\Http\Requests\Reports\SummaryDashboardRequest;
use App\Services\Reports\ReportingService;
use Carbon\CarbonInterface;
use Illuminate\Foundation\Http\FormRequest;
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
     * Drill-down behind one dashboard card: its headline, the segments and
     * series that explain it, and the records underneath — computed with the
     * exact period semantics of summary(), so the page always ties back to
     * the card.
     */
    public function kpi(KpiDetailRequest $request): JsonResponse
    {
        $metric = KpiMetric::from($request->validated('metric'));
        $period = $this->period($request);

        return response()->json(
            $this->reporting->kpiDetail($metric, $period['from'], $period['to']),
        );
    }

    /**
     * Defaults to the current calendar month — the natural home view.
     *
     * @return array{from: CarbonInterface, to: CarbonInterface}
     */
    private function period(FormRequest $request): array
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
