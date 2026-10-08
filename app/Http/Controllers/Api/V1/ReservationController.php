<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Reservations\ActivateReservationAction;
use App\Actions\Reservations\CancelReservationAction;
use App\Actions\Reservations\CompleteReservationAction;
use App\Actions\Reservations\ConfirmReservationAction;
use App\Actions\Reservations\CreateReservationAction;
use App\Actions\Reservations\ExtendReservationAction;
use App\Actions\Reservations\NoShowReservationAction;
use App\Actions\Reservations\UpdateReservationAction;
use App\Exceptions\PermissionDeniedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ActivateReservationRequest;
use App\Http\Requests\Reservations\AvailabilityCheckRequest;
use App\Http\Requests\Reservations\CalendarReservationRequest;
use App\Http\Requests\Reservations\CancelReservationRequest;
use App\Http\Requests\Reservations\CompleteReservationRequest;
use App\Http\Requests\Reservations\ConfirmReservationRequest;
use App\Http\Requests\Reservations\ExtendReservationRequest;
use App\Http\Requests\Reservations\IndexReservationRequest;
use App\Http\Requests\Reservations\NoShowReservationRequest;
use App\Http\Requests\Reservations\StoreReservationRequest;
use App\Http\Requests\Reservations\UpdateReservationRequest;
use App\Http\Resources\ReservationCalendarResource;
use App\Http\Resources\ReservationChangeResource;
use App\Http\Resources\ReservationResource;
use App\Models\Car;
use App\Models\Reservation;
use App\Services\Reservations\AvailabilityService;
use App\Services\Reservations\ReservationQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Carbon;

/**
 * Thin HTTP layer: one method per use-case, actions injected per call.
 * All business rules live in the action layer; this class only translates
 * HTTP ↔ domain.
 */
class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationQueryService $queries,
        private readonly AvailabilityService $availability,
    ) {}

    public function index(IndexReservationRequest $request): AnonymousResourceCollection
    {
        return ReservationResource::collection($this->queries->paginate($request->validated()));
    }

    /**
     * Calendar feed: every reservation whose rental window overlaps the
     * optional [from, to] bounds. The full record is fetched lazily when an
     * event is opened for editing, so only a small projection ships here.
     */
    public function calendar(CalendarReservationRequest $request): AnonymousResourceCollection
    {
        return ReservationCalendarResource::collection($this->queries->calendar($request->validated()));
    }

    /**
     * Availability probe for the booking form: is this car free in the window?
     */
    public function availability(AvailabilityCheckRequest $request): JsonResponse
    {
        $car = Car::query()->findOrFail($request->validated('car_id'));

        $conflicts = $this->availability->conflicts(
            $car,
            Carbon::parse($request->validated('pickup_datetime')),
            Carbon::parse($request->validated('expected_return_datetime')),
        );

        return response()->json([
            'available' => $conflicts->isEmpty(),
            'conflicts' => $this->availability->present($conflicts),
        ]);
    }

    public function store(StoreReservationRequest $request, CreateReservationAction $action): JsonResponse
    {
        // An initial payment is a ledger write: accept it only when the same
        // permission the dedicated payments endpoint enforces is granted.
        if (($request->has('payment') || $request->has('payments'))
            && ! $request->user()->hasPermission('payments.create')) {
            throw new PermissionDeniedException('payments.create');
        }

        $reservation = $action->handle($request->validated(), $request->user());

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Reservation $reservation): ReservationResource
    {
        $reservation->load([
            'car.brand',
            'car.model',
            'primaryClient',
            'secondaryClient',
            'extras',
            'changes.createdBy',
            'createdBy',
            'approvedBy',
        ]);

        return new ReservationResource($reservation);
    }

    public function update(
        UpdateReservationRequest $request,
        Reservation $reservation,
        UpdateReservationAction $action,
    ): ReservationResource {
        return new ReservationResource(
            $action->handle($reservation, $request->validated(), $request->user()),
        );
    }

    public function changes(Reservation $reservation): AnonymousResourceCollection
    {
        return ReservationChangeResource::collection(
            $reservation->changes()->with('createdBy')->get(),
        );
    }

    public function confirm(
        Reservation $reservation,
        ConfirmReservationRequest $request,
        ConfirmReservationAction $action,
    ): ReservationResource {
        return new ReservationResource(
            $action->handle($reservation, $request->validated('reason'), $request->user()),
        );
    }

    public function activate(
        Reservation $reservation,
        ActivateReservationRequest $request,
        ActivateReservationAction $action,
    ): ReservationResource {
        $data = $request->validated();

        return new ReservationResource($action->handle(
            $reservation,
            $request->user(),
            $data['pickup_mileage'] ?? null,
            $data['pickup_fuel_level'] ?? null,
        ));
    }

    public function complete(
        Reservation $reservation,
        CompleteReservationRequest $request,
        CompleteReservationAction $action,
    ): ReservationResource {
        return new ReservationResource(
            $action->handle($reservation, $request->user(), $request->validated()),
        );
    }

    public function cancel(
        Reservation $reservation,
        CancelReservationRequest $request,
        CancelReservationAction $action,
    ): ReservationResource {
        return new ReservationResource(
            $action->handle($reservation, $request->validated('reason'), $request->user()),
        );
    }

    public function noShow(
        Reservation $reservation,
        NoShowReservationRequest $request,
        NoShowReservationAction $action,
    ): ReservationResource {
        return new ReservationResource(
            $action->handle($reservation, $request->validated('reason'), $request->user()),
        );
    }

    public function extend(
        Reservation $reservation,
        ExtendReservationRequest $request,
        ExtendReservationAction $action,
    ): ReservationResource {
        return new ReservationResource($action->handle(
            $reservation,
            Carbon::parse($request->validated('expected_return_datetime')),
            $request->validated('reason'),
            $request->user(),
        ));
    }
}
