<?php

namespace App\Services\Expenses;

use App\Enums\ExpenseStatus;
use App\Models\CarExpense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Read side of the expenses module. The agency global scope applies
 * automatically (BelongsToAgency). Cars are loaded withTrashed so expense
 * history stays browsable after a car is retired — a maintenance bill
 * remains reportable even when the vehicle left the fleet.
 */
class ExpenseQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexExpenseRequest.
     */
    private const SORTABLE = [
        'due_date',
        'amount',
        'created_at',
        'title',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     status?: string,
     *     type?: string,
     *     car_id?: int,
     *     due_from?: string,
     *     due_to?: string,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return $this->baseQuery($filters)
            ->orderBy(self::sortBy($filters['sort_by'] ?? null), self::sortDir($filters['sort_dir'] ?? null))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * Shared filtered query used by paginate(); kept public so the reporting
     * module can sum the exact same filtered set (dashboard totals).
     *
     * @param  array<string, mixed>  $filters
     */
    public function baseQuery(array $filters): Builder
    {
        return CarExpense::query()
            ->with([
                'car' => fn ($query) => $query->withTrashed(),
                'createdBy:id,first_name,last_name',
            ])
            ->when($filters['status'] ?? null, function ($query, string $status): void {
                if ($status === ExpenseStatus::Overdue->value) {
                    $query->overdue();

                    return;
                }

                $query->where('status', ExpenseStatus::from($status));
            })
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['car_id'] ?? null, fn ($query, $carId) => $query->where('car_id', $carId))
            ->when($filters['due_from'] ?? null, fn ($query, $date) => $query->whereDate('due_date', '>=', $date))
            ->when($filters['due_to'] ?? null, fn ($query, $date) => $query->whereDate('due_date', '<=', $date))
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(function ($builder) use ($term) {
                $like = '%'.trim($term).'%';

                $builder->where('title', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhere('vendor', 'like', $like)
                    ->orWhere(fn ($car) => $car->whereExists(
                        fn ($exists) => $exists->from('cars')
                            ->whereColumn('cars.id', 'car_expenses.car_id')
                            ->where('cars.registration_number', 'like', $like),
                    ));
            }));
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
