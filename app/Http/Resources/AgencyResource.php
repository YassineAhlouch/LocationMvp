<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyResource extends JsonResource
{
    /**
     * Full agency profile, including the legal/document fields printed on
     * rental contracts (ICE, registre de commerce, logo), the mileage policy
     * used to quote excess distance, and the single invoice layout the agency
     * prints.
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
            'invoice_template' => $this->invoiceTemplate
                ? new InvoiceTemplateResource($this->invoiceTemplate)
                : null,
            // The unit every amount is displayed in. Null until the platform
            // assigns one; the app then falls back to its default.
            'currency' => $this->currency === null ? null : [
                'id' => $this->currency->id,
                'code' => $this->currency->code,
                'name' => $this->currency->name,
                'symbol' => $this->currency->symbol,
                'decimals' => $this->currency->decimals,
            ],
        ];
    }
}
