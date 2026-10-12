<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Exceptions\Domain\BrandInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexBrandRequest;
use App\Http\Requests\Fleet\StoreBrandRequest;
use App\Http\Requests\Fleet\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Models\Car;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Platform-side brand catalog. Brands are shared master data, so this mirrors
 * the agency-facing BrandController but without agency-scoped activity logging
 * (a platform admin has no agency to attribute the audit row to).
 */
class BrandController extends Controller
{
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

        return (new BrandResource($brand))->response()->setStatusCode(201);
    }

    public function show(Brand $brand): BrandResource
    {
        $brand->loadCount('carModels as models_count');

        return new BrandResource($brand);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): BrandResource
    {
        $brand->update($request->validated());

        return new BrandResource($brand);
    }

    public function destroy(Brand $brand): Response
    {
        $used = Car::query()
            ->where(fn ($query) => $query
                ->where('brand_id', $brand->id)
                ->orWhereIn('model_id', $brand->carModels()->pluck('id')))
            ->exists();

        if ($used) {
            throw new BrandInUseException;
        }

        $brand->delete();

        return response()->noContent();
    }
}
