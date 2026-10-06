<?php

namespace App\Models;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'agency_id',
    'car_id',
    'type',
    'title',
    'description',
    'amount',
    'vendor',
    'start_date',
    'due_date',
    'paid_date',
    'attachment',
    'status',
    'created_by',
])]
class CarExpense extends Model
{
    use BelongsToAgency, HasFactory;

    protected function casts(): array
    {
        return [
            'type' => ExpenseType::class,
            'status' => ExpenseStatus::class,
            'amount' => 'decimal:2',
            'start_date' => 'date',
            'due_date' => 'date',
            'paid_date' => 'date',
        ];
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', ExpenseStatus::Pending)
            ->whereDate('due_date', '<', today());
    }
}
