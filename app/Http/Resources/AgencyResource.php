<?php

namespace App\Http\Resources;

use App\Enums\InvoiceTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyResource extends JsonResource
{
    /**
     * Full agency profile, including the legal/document fields printed on
     * rental contracts (ICE, registre de commerce, logo) and the mileage
     * policy used to quote excess distance.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'ice' => $this->ice,
            'rc' => $this->rc,
            'logo' => $this->logo_path,
            'daily_mileage_allowance' => (int) $this->daily_mileage_allowance,
            'extra_mileage_fee_per_km' => (float) $this->extra_mileage_fee_per_km,
            'invoice_template' => $this->invoice_template?->value ?? InvoiceTemplate::Classic->value,
        ];
    }
}
