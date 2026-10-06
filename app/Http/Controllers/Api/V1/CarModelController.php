<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\CarModelInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexCarModelRequest;
use App\Http\Requests\Fleet\StoreCarModelRequest;
use App\Http\Requests\Fleet\UpdateCarModelRequest;
use App\Http\Resources\CarModelResource;
use App\Models\Car;
use App\Models\CarModel;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CarModelController extends Controller
{
    use LogsActivity;

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

        $this->logActivity('fleet', 'created', $model, $request->user(), 'Car model created', null, ['brand_id' => $model->brand_id, 'name' => $model->name]);

        return (new CarModelResource($model))->response()->setStatusCode(201);
    }

    public function show(CarModel $carModel): CarModelResource
    {
        $carModel->load('brand:id,name');

        return new CarModelResource($carModel);
    }

    public function update(UpdateCarModelRequest $request, CarModel $carModel): CarModelResource
    {
        $keys = array_keys($request->validated());
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $carModel->getAttribute($key)])->all();

        $carModel->fill($request->validated());
        $carModel->save();

        $this->logActivity(
            'fleet',
            'updated',
            $carModel,
            $request->user(),
            'Car model updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $carModel->getAttribute($key)])->all(),
        );

        return new CarModelResource($carModel->load('brand:id,name'));
    }

    public function destroy(Request $request, CarModel $carModel): Response
    {
        if (Car::query()->where('model_id', $carModel->id)->exists()) {
            throw new CarModelInUseException;
        }

        $old = collect($carModel->toArray())->except(['created_at', 'updated_at'])->all();

        $carModel->delete();

        $this->logActivity('fleet', 'deleted', $carModel, $request->user(), 'Car model deleted', $old);

        return response()->noContent();
    }
}
