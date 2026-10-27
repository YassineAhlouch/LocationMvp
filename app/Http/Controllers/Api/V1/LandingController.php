<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Landing\FetchLandingCarsRequest;
use App\Http\Requests\Landing\StoreLandingReservationRequest;
use App\Http\Resources\LandingCarResource;
use App\Models\Car;
use App\Models\LandingReservation;
use App\Models\QrCode;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

/**
 * Public QR/landing API — no authentication: anyone scanning the printed
 * code hits these endpoints. Requests are agency-context free (no
 * ApplyAgencyScope), so the agency always comes from the car itself.
 */
class LandingController extends Controller
{
    private const EAGER_LOAD = [
        'brand:id,name',
        'model:id,name',
        'category:id,name',
        'images:car_id,image,is_primary,sort_order',
        'agency:id,name,currency_id',
        'agency.currency:id,code,symbol',
    ];

    /**
     * The cars advertised on a QR: either the fleet saved on a poster under
     * its slug (?qr=...) or an explicit selection by car slug (?cars=...).
     * Only rentable fleet members are returned — stale posters referencing
     * deleted, archived or currently unavailable cars simply contribute to
     * the list.
     */
    public function cars(FetchLandingCarsRequest $request): AnonymousResourceCollection
    {
        $cars = $request->has('qr')
            ? $this->carsAdvertisedByQr((string) $request->string('qr'))
            : $this->carsAdvertisedBySlugs($request->carSlugs());

        return LandingCarResource::collection($cars);
    }

    /** A guard against the car turning unavailable between validation and now. */
    public function store(StoreLandingReservationRequest $request): JsonResponse
    {
        $car = Car::query()->available()->find($request->validated('car_id'));

        if ($car === null) {
            throw ValidationException::withMessages([
                'car_id' => 'This vehicle is not available for reservation.',
            ]);
        }

        $reservation = LandingReservation::create([
            'agency_id' => $car->agency_id,
            'car_id' => $car->id,
            ...$request->safe()->only([
                'full_name',
                'phone',
                'email',
                'pickup_datetime',
                'expected_return_datetime',
                'message',
            ]),
        ]);

        return response()->json([
            'message' => 'Your reservation request has been received.',
            'id' => $reservation->id,
        ], 201);
    }

    /**
     * Fleet saved on a poster: resolved through its qr_codes row, so the
     * page a poster opens can change its cars without reprinting. An
     * unknown or deleted poster yields an empty catalog, not an error.
     */
    private function carsAdvertisedByQr(string $slug): Collection
    {
        $qr = QrCode::query()->where('slug', $slug)->first();

        if ($qr === null) {
            return new Collection;
        }

        return $qr->cars()
            ->available()
            ->with(self::EAGER_LOAD)
            ->orderBy('daily_price')
            ->get();
    }

    /** Ad-hoc selection: the QR encodes the fleet membership directly. */
    private function carsAdvertisedBySlugs(array $slugs): Collection
    {
        return Car::query()
            ->available()
            ->whereIn('slug', $slugs)
            ->with(self::EAGER_LOAD)
            ->orderBy('daily_price')
            ->get();
    }
}
