<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\BrandInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexBrandRequest;
use App\Http\Requests\Fleet\IndexCarModelRequest;
use App\Http\Requests\Fleet\StoreBrandRequest;
use App\Http\Requests\Fleet\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Http\Resources\CarModelResource;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class BrandController extends Controller
{
    use LogsActivity;

    public function index(IndexBrandRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $direction = ($filters['sort_dir'] ?? null) === 'asc' ? 'asc' : 'desc';
        $sortBy = in_array($filters['sort_by'] ?? null, ['name', 'created_at'], true) ? $filters['sort_by'] : 'name';

        return BrandResource::collection(
            Brand::query()
                ->withCount('carModels as models_count')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where('name', 'like', '%'.trim($term).'%'))
                ->orderBy($sortBy, $direction)
                ->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreBrandRequest $request): JsonResponse
    {
        $brand = Brand::create($request->validated());

        $this->logActivity('fleet', 'created', $brand, $request->user(), 'Brand created', null, ['name' => $brand->name]);

        return (new BrandResource($brand))->response()->setStatusCode(201);
    }

    public function show(Brand $brand): BrandResource
    {
        $brand->loadCount('carModels as models_count');

        return new BrandResource($brand);
    }

    /**
     * Models of one brand — the picker the car form uses.
     */
    public function models(Brand $brand, IndexCarModelRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        return CarModelResource::collection(
            CarModel::query()
                ->where('brand_id', $brand->id)
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where('name', 'like', '%'.trim($term).'%'))
                ->orderBy('name')
                ->paginate(min((int) ($filters['per_page'] ?? 100), 100)),
        );
    }

    public function update(UpdateBrandRequest $request, Brand $brand): BrandResource
    {
        $keys = array_keys($request->validated());
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $brand->getAttribute($key)])->all();

        $brand->fill($request->validated());
        $brand->save();

        $this->logActivity(
            'fleet',
            'updated',
            $brand,
            $request->user(),
            'Brand updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $brand->getAttribute($key)])->all(),
        );

        return new BrandResource($brand);
    }

    public function destroy(Request $request, Brand $brand): Response
    {
        // Deleting a brand cascades to its models, which cars restrict on —
        // so any car touching the brand (directly or via one of its models)
        // must block the delete. Grouped so the agency scope stays intact.
        $used = Car::query()
            ->where(fn ($query) => $query
                ->where('brand_id', $brand->id)
                ->orWhereIn('model_id', $brand->carModels()->pluck('id')))
            ->exists();

        if ($used) {
            throw new BrandInUseException;
        }

        $old = collect($brand->toArray())->except(['created_at', 'updated_at'])->all();

        $brand->delete();

        $this->logActivity('fleet', 'deleted', $brand, $request->user(), 'Brand deleted', $old);

        return response()->noContent();
    }
}
