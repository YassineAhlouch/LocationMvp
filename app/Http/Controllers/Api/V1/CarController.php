<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\Domain\CarHasReservationsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cars\IndexCarRequest;
use App\Http\Requests\Cars\StoreCarRequest;
use App\Http\Requests\Cars\UpdateCarRequest;
use App\Http\Resources\CarResource;
use App\Models\Car;
use App\Services\Activity\LogsActivity;
use App\Services\Cars\CarQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;

class CarController extends Controller
{
    use LogsActivity;

    public function __construct(private readonly CarQueryService $cars) {}

    public function index(IndexCarRequest $request): AnonymousResourceCollection
    {
        return CarResource::collection($this->cars->paginate($request->validated()));
    }

    public function store(StoreCarRequest $request): JsonResponse
    {
        $car = Car::create(array_merge(Arr::except($request->validated(), ['images']), [
            'agency_id' => $request->user()->agency_id,
        ]));

        // create() carries only the attributes passed in — refresh so the
        // response reflects DB defaults (status=available, is_active=true).
        $car->refresh();

        if ($request->has('images')) {
            $this->syncImages($car, $request->validated('images'));
        }

        $this->loadRelations($car);
        $car->loadCount('images as images_count');

        $this->logActivity('fleet', 'created', $car, $request->user(), 'Car created', null, $this->auditValues($car));

        return (new CarResource($car))->response()->setStatusCode(201);
    }

    public function show(Car $car): CarResource
    {
        $this->loadRelations($car);
        $car->loadCount('images as images_count');

        return new CarResource($car);
    }

    public function update(UpdateCarRequest $request, Car $car): CarResource
    {
        $validated = $request->validated();
        $keys = array_values(array_diff(array_keys($validated), ['images']));
        $old = $this->auditValues($car, $keys);

        $car->fill(Arr::except($validated, ['images']));
        $car->save();

        if ($request->has('images')) {
            $this->syncImages($car, $validated['images']);
        }

        $this->loadRelations($car);
        $car->loadCount('images as images_count');

        $this->logActivity('fleet', 'updated', $car, $request->user(), 'Car updated', $old, $this->auditValues($car, $keys));

        return new CarResource($car);
    }

    public function destroy(Request $request, Car $car): Response
    {
        // Reservations reference the car with restrictOnDelete; even soft
        // deleting would blank the car context from reservation history, so a
        // booked car is retired (status=inactive) rather than deleted.
        if ($car->reservations()->exists()) {
            throw new CarHasReservationsException;
        }

        $old = $this->auditValues($car);

        $car->delete();

        $this->logActivity('fleet', 'deleted', $car, $request->user(), 'Car deleted', $old);

        return response()->noContent();
    }

    private function loadRelations(Car $car): void
    {
        $car->load([
            'brand:id,name',
            'model:id,name',
            'category:id,name',
            'images',
        ]);
    }

    /**
     * Replace the gallery wholesale. Business rule: at most one primary image
     * — the first flagged primary wins; if none is flagged the first image by
     * sort order becomes primary. Kept on the car, never on reservation rows,
     * so replace-all is safe.
     *
     * @param  array<int, array{image: string, is_primary?: bool, sort_order?: int}>  $images
     */
    private function syncImages(Car $car, array $images): void
    {
        $car->images()->delete();

        $rows = [];
        $primaryTaken = false;

        foreach ($images as $index => $image) {
            $isPrimary = (bool) ($image['is_primary'] ?? false);

            if ($isPrimary && $primaryTaken) {
                $isPrimary = false;
            }
            $primaryTaken = $primaryTaken || $isPrimary;

            $rows[] = [
                'image' => $image['image'],
                'is_primary' => $isPrimary,
                'sort_order' => $image['sort_order'] ?? $index,
            ];
        }

        if ($rows !== [] && ! $primaryTaken) {
            $rows[0]['is_primary'] = true;
        }

        $car->images()->createMany($rows);
    }

    /**
     * Cast-aware attribute snapshot for the audit trail.
     *
     * @param  array<int, string>|null  $keys
     * @return array<string, mixed>
     */
    private function auditValues(Car $car, ?array $keys = null): array
    {
        if ($keys !== null) {
            return collect($keys)
                ->mapWithKeys(fn (string $key) => [$key => $car->getAttribute($key)])
                ->all();
        }

        return collect($car->toArray())->except(['created_at', 'updated_at', 'deleted_at'])->all();
    }
}
