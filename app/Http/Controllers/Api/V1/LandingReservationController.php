<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\LandingReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Landing\IndexLandingReservationRequest;
use App\Http\Requests\Landing\UpdateLandingReservationStatusRequest;
use App\Http\Resources\LandingReservationResource;
use App\Models\LandingReservation;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingReservationController extends Controller
{
    use LogsActivity;

    /**
     * The reservation requests customers left on the public QR landing.
     * Agency scope comes from BelongsToAgency, so the staff only sees the
     * leads aimed at their own fleet.
     */
    public function index(IndexLandingReservationRequest $request): AnonymousResourceCollection
    {
        $query = LandingReservation::query()
            ->with([
                'car.brand:id,name',
                'car.model:id,name',
                'car.images:car_id,image,is_primary,sort_order',
            ])
            ->latest();

        if ($status = $request->validated('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->validated('q')) {
            $terms = str($search)->split('/\s+/')->all();

            $query->where(function ($builder) use ($terms) {
                foreach ($terms as $term) {
                    $like = '%'.addcslashes($term, '%_\\').'%';

                    $builder->where(function ($inner) use ($like) {
                        $inner
                            ->orWhere('full_name', 'like', $like)
                            ->orWhere('phone', 'like', $like)
                            ->orWhere('email', 'like', $like)
                            ->orWhere('message', 'like', $like);
                    });
                }
            });
        }

        return LandingReservationResource::collection(
            $query->paginate(
                min((int) $request->validated('per_page', 15), 100),
            ),
        );
    }

    /**
     * One pipeline step at a time, following the transitions the status enum
     * allows (new → contacted → converted/rejected). Terminal statuses stay
     * put so an accidental click cannot rewrite history.
     */
    public function updateStatus(
        UpdateLandingReservationStatusRequest $request,
        LandingReservation $landingReservation,
    ): JsonResource {
        $target = LandingReservationStatus::from(
            $request->validated('status'),
        );

        abort_if(
            ! in_array($target, $landingReservation->status->transitions(), true),
            422,
            "A \"{$landingReservation->status->value}\" request cannot move to \"{$target->value}\".",
        );

        $oldStatus = $landingReservation->status->value;

        $landingReservation->update(['status' => $target]);

        $this->logActivity(
            module: 'reservations',
            action: 'updated',
            entity: $landingReservation,
            actor: $request->user(),
            description: "Landing request status set to {$target->value}",
            oldValues: ['status' => $oldStatus],
            newValues: ['status' => $target->value],
        );

        return new LandingReservationResource($landingReservation);
    }
}
