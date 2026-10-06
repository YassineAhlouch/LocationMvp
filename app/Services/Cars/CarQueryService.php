<?php

namespace App\Services\Cars;

use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Models\Car;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Read side of the fleet module. The agency global scope applies
 * automatically (BelongsToAgency); brands/models/categories are matched via
 * correlated EXISTS subqueries so the page's COUNT stays exact.
 */
class CarQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexCarRequest.
     */
    private const SORTABLE = [
        'daily_price',
        'year',
        'created_at',
        'registration_number',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     status?: string,
     *     category_id?: int,
     *     brand_id?: int,
     *     fuel_type?: string,
     *     transmission_type?: string,
     *     seats_count?: int,
     *     is_active?: bool,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Car::query()
            ->with([
                'brand:id,name',
                'model:id,name',
                'category:id,name',
            ])
            ->withCount('images')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', CarStatus::from($status)))
            ->when($filters['category_id'] ?? null, fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($filters['brand_id'] ?? null, fn ($query, $brandId) => $query->where('brand_id', $brandId))
            ->when($filters['fuel_type'] ?? null, fn ($query, $fuel) => $query->where('fuel_type', FuelType::from($fuel)))
            ->when($filters['transmission_type'] ?? null, fn ($query, $transmission) => $query->where('transmission_type', TransmissionType::from($transmission)))
            ->when($filters['seats_count'] ?? null, fn ($query, $seats) => $query->where('seats_count', $seats))
            // NB: array_key_exists, not when($value) — is_active=false is a
            // legitimate filter and when(false, ...) would silently skip it.
            ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
            ->when($filters['q'] ?? null, fn ($query, $term) => self::applySearch($query, $term))
            ->orderBy(self::sortBy($filters['sort_by'] ?? null), self::sortDir($filters['sort_dir'] ?? null))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    private static function applySearch($query, string $term): void
    {
        $like = '%'.trim($term).'%';

        $query->where(function ($builder) use ($like) {
            $builder->where('registration_number', 'like', $like)
                ->orWhere('vin', 'like', $like)
                ->orWhere(fn ($brand) => $brand->whereExists(
                    fn ($exists) => $exists->from('brands')
                        ->whereColumn('brands.id', 'cars.brand_id')
                        ->where('brands.name', 'like', $like),
                ))
                ->orWhere(fn ($model) => $model->whereExists(
                    fn ($exists) => $exists->from('car_models')
                        ->whereColumn('car_models.id', 'cars.model_id')
                        ->where('car_models.name', 'like', $like),
                ))
                ->orWhere(fn ($category) => $category->whereExists(
                    fn ($exists) => $exists->from('car_categories')
                        ->whereColumn('car_categories.id', 'cars.category_id')
                        ->where('car_categories.name', 'like', $like),
                ));
        });
    }

    private static function sortBy(?string $value): string
    {
        return in_array($value, self::SORTABLE, true) ? $value : 'created_at';
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }
}
