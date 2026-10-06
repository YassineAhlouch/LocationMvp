<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\IndexReservationChangeRequest;
use App\Http\Resources\ReservationChangeResource;
use App\Services\Reservations\ReservationQueryService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Agency-wide feed of reservation field diffs — the per-reservation view
 * lives on ReservationController@changes.
 */
class ReservationChangeController extends Controller
{
    public function __construct(private readonly ReservationQueryService $reservations) {}

    public function index(IndexReservationChangeRequest $request): AnonymousResourceCollection
    {
        return ReservationChangeResource::collection(
            $this->reservations->paginateChanges($request->validated()),
        );
    }
}
