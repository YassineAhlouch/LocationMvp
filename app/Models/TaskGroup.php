<?php

namespace App\Models;

use App\Models\Concerns\BelongsToAgency;
use Database\Factories\TaskGroupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskGroup extends Model
{
    /** @use HasFactory<TaskGroupFactory> */
    use BelongsToAgency, HasFactory;

    protected $fillable = [
        'agency_id',
        'name',
        'color',
        'position',
    ];
}
