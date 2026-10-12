<?php

namespace App\Http\Resources;

use App\Enums\PaymentRecordStatus;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Platform-facing invoice view of a reservation: everything a printable
 * invoice needs — tenant, client, car, line items, deductions and the
 * payment ledger — in one payload, so the parent dashboard can render an
 * invoice without extra round trips.
 */
class PlatformInvoiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $paid = $this->payments !== null
            ? (float) $this->payments->where('status', PaymentRecordStatus::Paid)->sum('amount')
            : null;

        return [
            'id' => $this->id,
            'reservation_number' => $this->reservation_number,
            'status' => $this->status?->value,
            'payment_status' => $this->payment_status?->value,

            'agency' => $this->whenLoaded('agency', fn () => [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
                'email' => $this->agency->email,
                'phone' => $this->agency->phone,
                'address' => $this->agency->address,
                'city' => $this->agency->city,
                'country' => $this->agency->country,
                'currency' => $this->agency->relationLoaded('currency') && $this->agency->currency !== null ? [
                    'id' => $this->agency->currency->id,
                    'code' => $this->agency->currency->code,
                    'name' => $this->agency->currency->name,
                    'symbol' => $this->agency->currency->symbol,
                    'decimals' => $this->agency->currency->decimals,
                ] : null,
            ]),

            'car' => $this->whenLoaded('car', fn () => [
                'id' => $this->car->id,
                'registration_number' => $this->car->registration_number,
                'brand' => $this->car->relationLoaded('brand') ? $this->car->brand?->name : null,
                'model' => $this->car->relationLoaded('model') ? $this->car->model?->name : null,
            ]),

            'primary_client' => $this->clientSummary($this->primaryClient),
            'secondary_client' => $this->clientSummary($this->secondaryClient),

            'pickup_location' => $this->pickup_location,
            'return_location' => $this->return_location,
            'pickup_datetime' => $this->pickup_datetime?->toIso8601String(),
            'expected_return_datetime' => $this->expected_return_datetime?->toIso8601String(),
            'actual_return_datetime' => $this->actual_return_datetime?->toIso8601String(),

            'daily_rate' => (float) $this->daily_rate,
            'rental_days' => $this->rental_days,
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'discount_reason' => $this->discount_reason,
            'tax_amount' => (float) $this->tax_amount,
            'deposit_amount' => (float) $this->deposit_amount,
            'total_amount' => (float) $this->total_amount,

            'paid_amount' => $paid,
            'balance_amount' => $paid !== null ? round(max($this->total_amount - $paid, 0), 2) : null,

            'extras' => $this->whenLoaded('extras', fn () => $this->extras->map(fn ($extra) => [
                'name' => $extra->name,
                'quantity' => $extra->quantity,
                'unit_price' => (float) $extra->unit_price,
                'total_price' => (float) $extra->total_price,
            ])->values()),

            'payments' => $this->whenLoaded('payments', fn () => $this->payments->map(fn ($payment) => [
                'id' => $payment->id,
                'payment_date' => $payment->payment_date?->toIso8601String(),
                'amount' => (float) $payment->amount,
                'method' => $payment->method?->value,
                'reference' => $payment->reference,
                'status' => $payment->status?->value,
                'notes' => $payment->notes,
            ])->values()),

            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function clientSummary(?Client $client): ?array
    {
        return $client !== null ? [
            'id' => $client->id,
            'full_name' => $client->full_name,
            'phone' => $client->phone,
            'email' => $client->email,
            'cin' => $client->cin,
        ] : null;
    }
}
