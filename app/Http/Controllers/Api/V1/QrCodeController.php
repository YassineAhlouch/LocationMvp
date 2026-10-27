<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Qr\StoreQrCodeRequest;
use App\Http\Requests\Qr\UpdateQrCodeRequest;
use App\Http\Resources\QrCodeResource;
use App\Models\QrCode;
use App\Services\Activity\LogsActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class QrCodeController extends Controller
{
    use LogsActivity;

    /**
     * One row per printed poster. The catalog is tiny and agency-owned, so
     * the listing has no filters or pagination — every code is returned with
     * the picker-friendly summary of the fleet it advertises.
     */
    public function index(): AnonymousResourceCollection
    {
        return QrCodeResource::collection(
            QrCode::query()
                ->with('cars.brand:id,name', 'cars.model:id,name')
                ->latest()
                ->get(),
        );
    }

    public function store(StoreQrCodeRequest $request): JsonResponse
    {
        $qr = QrCode::create([
            'agency_id' => $request->user()->agency_id,
            'name' => $request->validated('name'),
        ]);

        // The creating hook derives the slug from the name — read it back so
        // the response already carries the printable link.
        $qr->refresh();
        $qr->cars()->sync($request->validated('car_ids'));
        $this->loadCars($qr);

        $this->logActivity('fleet', 'created', $qr, $request->user(), 'QR code created', null, $this->auditValues($qr));

        return (new QrCodeResource($qr))->response()->setStatusCode(201);
    }

    public function show(QrCode $qrCode): QrCodeResource
    {
        $this->loadCars($qrCode);

        return new QrCodeResource($qrCode);
    }

    public function update(UpdateQrCodeRequest $request, QrCode $qrCode): QrCodeResource
    {
        $old = $this->auditValues($qrCode);

        $qrCode->fill($request->safe()->only(['name']));
        $qrCode->save();

        $carIds = $request->validated('car_ids');
        if ($carIds !== null) {
            $qrCode->cars()->sync($carIds);
        }

        $this->loadCars($qrCode);

        $this->logActivity('fleet', 'updated', $qrCode, $request->user(), 'QR code updated', $old, $this->auditValues($qrCode));

        return new QrCodeResource($qrCode);
    }

    public function destroy(Request $request, QrCode $qrCode): Response
    {
        $old = $this->auditValues($qrCode);

        $qrCode->delete();

        $this->logActivity('fleet', 'deleted', $qrCode, $request->user(), 'QR code deleted', $old);

        return response()->noContent();
    }

    private function loadCars(QrCode $qr): void
    {
        $qr->load(['cars.brand:id,name', 'cars.model:id,name']);
    }

    /**
     * Cast-aware attribute snapshot for the audit trail.
     *
     * @return array<string, mixed>
     */
    private function auditValues(QrCode $qr): array
    {
        return collect($qr->toArray())->except(['created_at', 'updated_at'])->all();
    }
}
