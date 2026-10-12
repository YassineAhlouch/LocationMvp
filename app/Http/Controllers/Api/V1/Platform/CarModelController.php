<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Exceptions\Domain\CarModelInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexCarModelRequest;
use App\Http\Requests\Fleet\StoreCarModelRequest;
use App\Http\Requests\Fleet\UpdateCarModelRequest;
use App\Http\Resources\CarModelResource;
use App\Models\Car;
use App\Models\CarModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Platform-side car-model catalog. Shared master data, mirroring the
 * agency-facing CarModelController without agency-scoped activity logging.
 */
class CarModelController extends Controller
{
    public function index(IndexCarModelRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        return CarModelResource::collection(
            CarModel::query()
                ->with('brand:id,name')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where('name', 'like', '%'.trim($term).'%'))
                ->when($filters['brand_id'] ?? null, fn ($query, $brandId) => $query->where('brand_id', $brandId))
                ->orderBy('name')
                ->paginate(min((int) ($filters['per_page'] ?? 30), 100)),
        );
    }

    public function store(StoreCarModelRequest $request): JsonResponse
    {
        $model = CarModel::create($request->validated());
        $model->load('brand:id,name');

        return (new CarModelResource($model))->response()->setStatusCode(201);
    }

    public function show(CarModel $carModel): CarModelResource
    {
        return new CarModelResource($carModel->load('brand:id,name'));
    }

    public function update(UpdateCarModelRequest $request, CarModel $carModel): CarModelResource
    {
        $carModel->update($request->validated());

        return new CarModelResource($carModel->load('brand:id,name'));
    }

    public function destroy(CarModel $carModel): Response
    {
        if (Car::query()->where('model_id', $carModel->id)->exists()) {
            throw new CarModelInUseException;
        }

        $carModel->delete();

        return response()->noContent();
    }
}
