<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $members = $this->users->map(function ($user) {
            return [
                'id' => (string) $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'img' => $user->avatar ?? '',
                'permissionRole' => 'member',
                'status' => 'active',
            ];
        })->values();

        return [
            'id' => (string) $this->id,
            'subject' => $this->subject,
            'columnId' => $this->column_id,
            'description' => $this->description ?? '',
            'cover' => $this->cover ?? '',
            'members' => $members,
            'tags' => is_array($this->tags) ? $this->tags : (json_decode($this->tags, true) ?? []),
            'priority' => $this->priority ?? 'Medium',
            'dueDate' => $this->due_date ? $this->due_date->format('Y-m-d\TH:i:s.000\Z') : now()->format('Y-m-d\TH:i:s.000\Z'),
            'visibility' => $this->visibility ?? 'shared',
            'created_by' => $this->created_by,
        ];
    }
}
