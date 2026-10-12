<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Platform\IndexInvoiceRequest;
use App\Http\Resources\PlatformInvoiceResource;
use App\Models\Reservation;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Platform-wide invoice (reservation) listing. Every reservation is the
 * source of a printable invoice, so "invoices" here are reservations served
 * through an invoice-shaped resource. agency_id is optional on purpose: pick
 * one tenant or watch the whole platform.
 */
class InvoiceController extends Controller
{
    public function index(IndexInvoiceRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $query = Reservation::query()
            ->with([
                'agency:id,name,email,phone,address,city,country,currency_id',
                'agency.currency:id,code,name,symbol,decimals',
                'car:id,registration_number,brand_id,model_id',
                'car.brand:id,name',
                'car.model:id,name',
                'primaryClient:id,first_name,last_name,phone,email,cin',
                'secondaryClient:id,first_name,last_name,phone,email,cin',
                'extras:id,reservation_id,name,quantity,unit_price',
                'payments:id,reservation_id,payment_date,amount,method,reference,status,notes',
            ])
            ->when($filters['agency_id'] ?? null, fn ($query, $agencyId) => $query->where('agency_id', $agencyId))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', PaymentStatus::from($status)))
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(function ($builder) use ($term) {
                $like = '%'.trim($term).'%';

                $builder->where('reservation_number', 'like', $like)
                    ->orWhereHas('primaryClient', fn ($client) => $client->where('first_name', 'like', $like)->orWhere('last_name', 'like', $like))
                    ->orWhereHas('car', fn ($car) => $car->where('registration_number', 'like', $like));
            }))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));

        return PlatformInvoiceResource::collection($query);
    }
}
