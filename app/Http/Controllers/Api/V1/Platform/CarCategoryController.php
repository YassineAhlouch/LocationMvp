<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Exceptions\Domain\CarCategoryInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexCarCategoryRequest;
use App\Http\Requests\Fleet\StoreCarCategoryRequest;
use App\Http\Requests\Fleet\UpdateCarCategoryRequest;
use App\Http\Resources\CarCategoryResource;
use App\Models\Car;
use App\Models\CarCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Platform-side car-category catalog. Shared master data, mirroring the
 * agency-facing CarCategoryController without agency-scoped activity logging.
 */
class CarCategoryController extends Controller
{
    public function index(IndexCarCategoryRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $direction = ($filters['sort_dir'] ?? null) === 'asc' ? 'asc' : 'desc';
        $sortBy = in_array($filters['sort_by'] ?? null, ['name', 'created_at'], true) ? $filters['sort_by'] : 'name';

        return CarCategoryResource::collection(
            CarCategory::query()
                ->withCount('cars as cars_count')
                ->when($filters['q'] ?? null, fn ($query, $term) => $query->where('name', 'like', '%'.trim($term).'%'))
                ->orderBy($sortBy, $direction)
                ->paginate(min((int) ($filters['per_page'] ?? 15), 100)),
        );
    }

    public function store(StoreCarCategoryRequest $request): JsonResponse
    {
        $category = CarCategory::create($request->validated());

        return (new CarCategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(CarCategory $category): CarCategoryResource
    {
        $category->loadCount('cars as cars_count');

        return new CarCategoryResource($category);
    }

    public function update(UpdateCarCategoryRequest $request, CarCategory $category): CarCategoryResource
    {
        $category->update($request->validated());

        return new CarCategoryResource($category);
    }

    public function destroy(CarCategory $category): Response
    {
        if (Car::query()->where('category_id', $category->id)->exists()) {
            throw new CarCategoryInUseException;
        }

        $category->delete();

        return response()->noContent();
    }
}
