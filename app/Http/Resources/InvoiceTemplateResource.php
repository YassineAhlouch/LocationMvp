<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceTemplateResource extends JsonResource
{
    /**
     * A contract layout the frontend can render. The slug is the stable key
     * used to pick the React component; name is the human label shown in the
     * assignment dropdown.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'is_active' => $this->is_active,
        ];
    }
}
