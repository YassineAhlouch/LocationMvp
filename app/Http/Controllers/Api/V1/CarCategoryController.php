<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\CarCategoryInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Fleet\IndexCarCategoryRequest;
use App\Http\Requests\Fleet\StoreCarCategoryRequest;
use App\Http\Requests\Fleet\UpdateCarCategoryRequest;
use App\Http\Resources\CarCategoryResource;
use App\Models\Car;
use App\Models\CarCategory;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CarCategoryController extends Controller
{
    use LogsActivity;

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

        $this->logActivity('fleet', 'created', $category, $request->user(), 'Car category created', null, ['name' => $category->name]);

        return (new CarCategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(CarCategory $category): CarCategoryResource
    {
        $category->loadCount('cars as cars_count');

        return new CarCategoryResource($category);
    }

    public function update(UpdateCarCategoryRequest $request, CarCategory $category): CarCategoryResource
    {
        $keys = array_keys($request->validated());
        $old = collect($keys)->mapWithKeys(fn (string $key) => [$key => $category->getAttribute($key)])->all();

        $category->fill($request->validated());
        $category->save();

        $this->logActivity(
            'fleet',
            'updated',
            $category,
            $request->user(),
            'Car category updated',
            $old,
            collect($keys)->mapWithKeys(fn (string $key) => [$key => $category->getAttribute($key)])->all(),
        );

        return new CarCategoryResource($category);
    }

    public function destroy(Request $request, CarCategory $category): Response
    {
        if (Car::query()->where('category_id', $category->id)->exists()) {
            throw new CarCategoryInUseException;
        }

        $old = collect($category->toArray())->except(['created_at', 'updated_at'])->all();

        $category->delete();

        $this->logActivity('fleet', 'deleted', $category, $request->user(), 'Car category deleted', $old);

        return response()->noContent();
    }
}
