<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'role' => [
                'id' => $this->role?->id,
                'name' => $this->role?->name,
                'permissions' => $this->role?->permissions ?? [],
            ],
            // Role-based menu gating: every staff member carries 'user' so the
            // shared navigation shows, while admin-only entries require 'admin'.
            'authority' => array_values(array_filter([$this->role?->name, 'user'])),
            'agency' => [
                'id' => $this->agency?->id,
                'name' => $this->agency?->name,
            ],
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
