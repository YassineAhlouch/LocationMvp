<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cars\CarStatisticsRequest;
use App\Http\Requests\Financing\MarkInstallmentPaidRequest;
use App\Http\Requests\Financing\StoreCarFinancingRequest;
use App\Http\Requests\Financing\UpdateCarFinancingRequest;
use App\Http\Resources\CarFinancingResource;
use App\Http\Resources\CarInstallmentResource;
use App\Models\Car;
use App\Models\CarInstallment;
use App\Services\Cars\CarFinancingService;
use App\Services\Cars\CarStatisticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

/**
 * Car financing & profitability. The car dossier page's statistics section
 * reads from statistics(); the financing/installment endpoints drive the
 * purchase-financing records it summarises.
 *
 * Everything is reached through the agency-scoped {car} binding, so financing
 * and installments never leak across tenants.
 */
class CarFinancingController extends Controller
{
    public function __construct(
        private readonly CarStatisticsService $statistics,
        private readonly CarFinancingService $financings,
    ) {}

    /**
     * kpis, financing_progress, monthly_series, utilization and
     * expenses_by_type for one car, plus its full installment schedule.
     */
    public function statistics(CarStatisticsRequest $request, Car $car): JsonResponse
    {
        $months = (int) $request->validated('months', 12);

        $financing = $car->financing()->first();

        return response()->json(array_merge(
            $this->statistics->statistics($car, $months),
            [
                'financing' => $financing === null
                    ? null
                    : (new CarFinancingResource($financing))->resolve(),
                'installments' => CarInstallmentResource::collection(
                    $car->installments()->get(),
                )->resolve(),
            ],
        ));
    }

    public function store(StoreCarFinancingRequest $request, Car $car): JsonResponse
    {
        if ($car->financing()->exists()) {
            throw ValidationException::withMessages([
                'purchase_date' => 'This vehicle already has a financing plan.',
            ]);
        }

        $financing = $this->financings->create($car, $request->validated(), $request->user());

        return (new CarFinancingResource($financing))->response()->setStatusCode(201);
    }

    public function update(UpdateCarFinancingRequest $request, Car $car): CarFinancingResource
    {
        $financing = $car->financing()->firstOrFail();

        return new CarFinancingResource(
            $this->financings->update($financing, $request->validated(), $request->user()),
        );
    }

    public function destroy(Request $request, Car $car): Response
    {
        $this->financings->delete($car->financing()->firstOrFail(), $request->user());

        return response()->noContent();
    }

    public function payInstallment(MarkInstallmentPaidRequest $request, Car $car, CarInstallment $installment): CarInstallmentResource
    {
        // The car binding is agency-scoped; confirm the installment belongs to
        // that car before touching it.
        if ($installment->car_id !== $car->id) {
            abort(404);
        }

        return new CarInstallmentResource(
            $this->financings->markPaid($installment, $request->validated(), $request->user()),
        );
    }
}
