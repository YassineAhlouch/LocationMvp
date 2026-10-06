<?php

namespace App\Models;

use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Models\Concerns\BelongsToAgency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'agency_id',
    'brand_id',
    'model_id',
    'category_id',
    'registration_number',
    'vin',
    'year',
    'color',
    'seats_count',
    'doors_count',
    'transmission_type',
    'fuel_type',
    'daily_price',
    'purchase_price',
    'initial_mileage',
    'current_mileage',
    'current_fuel_level',
    'insurance_company',
    'insurance_policy_number',
    'insurance_expiry_date',
    'technical_inspection_expiry',
    'next_service_mileage',
    'last_maintenance_at',
    'status',
    'is_active',
    'notes',
])]
class Car extends Model
{
    use BelongsToAgency, HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => CarStatus::class,
            'transmission_type' => TransmissionType::class,
            'fuel_type' => FuelType::class,
            'daily_price' => 'decimal:2',
            'purchase_price' => 'decimal:2',
            'year' => 'integer',
            'seats_count' => 'integer',
            'doors_count' => 'integer',
            'initial_mileage' => 'integer',
            'current_mileage' => 'integer',
            'current_fuel_level' => 'integer',
            'next_service_mileage' => 'integer',
            'insurance_expiry_date' => 'date',
            'technical_inspection_expiry' => 'date',
            'last_maintenance_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(CarModel::class, 'model_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CarCategory::class, 'category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(CarImage::class)->orderBy('sort_order');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(CarExpense::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', CarStatus::Available)
            ->where('is_active', true);
    }

    public function scopeStatus(Builder $query, CarStatus $status): Builder
    {
        return $query->where('status', $status);
    }
}
