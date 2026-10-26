<?php

namespace App\Models;

use App\Models\Concerns\BelongsToAgency;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use BelongsToAgency, HasFactory, SoftDeletes;

    protected $fillable = [
        'agency_id',
        'created_by',
        'subject',
        'description',
        'column_id',
        'priority',
        'tags',
        'due_date',
        'cover',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'due_date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function scopeVisibleTo($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('visibility', 'shared')
                ->orWhere('created_by', $user->id)
                ->orWhereHas('users', fn ($uq) => $uq->where('users.id', $user->id));
        });
    }
}
