<?php

namespace App\Services\Payments;

use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use App\Models\Payment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Read side of the payments ledger. The agency global scope applies
 * automatically (BelongsToAgency). The reservation and its primary client are
 * eager-loaded so the ledger renders without N+1.
 */
class PaymentQueryService
{
    /**
     * Whitelisted sort columns — mirrored in IndexPaymentLedgerRequest.
     */
    private const SORTABLE = [
        'payment_date',
        'amount',
        'created_at',
        'status',
        'method',
    ];

    /**
     * @param  array{
     *     q?: string,
     *     status?: string,
     *     method?: string,
     *     from?: string,
     *     to?: string,
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
     * @param  array<string, mixed>  $filters
     */
    public function baseQuery(array $filters): Builder
    {
        return Payment::query()
            ->with([
                'reservation:id,reservation_number,primary_client_id',
                'reservation.primaryClient:id,first_name,last_name',
                'createdBy:id,first_name,last_name',
            ])
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', PaymentRecordStatus::from($status)))
            ->when($filters['method'] ?? null, fn ($query, string $method) => $query->where('method', PaymentMethod::from($method)))
            ->when($filters['from'] ?? null, fn ($query, string $date) => $query->whereDate('payment_date', '>=', $date))
            ->when($filters['to'] ?? null, fn ($query, string $date) => $query->whereDate('payment_date', '<=', $date))
            ->when($filters['q'] ?? null, fn ($query, string $term) => $query->where(function (Builder $builder) use ($term): void {
                $like = '%'.trim($term).'%';

                $builder->where('reference', 'like', $like)
                    ->orWhere('notes', 'like', $like)
                    ->orWhereHas('reservation', function (Builder $reservation) use ($like): void {
                        $reservation->where('reservation_number', 'like', $like)
                            ->orWhereHas('primaryClient', function (Builder $client) use ($like): void {
                                $client->where('first_name', 'like', $like)
                                    ->orWhere('last_name', 'like', $like);
                            });
                    });
            }));
    }

    private static function sortBy(?string $value): string
    {
        return in_array($value, self::SORTABLE, true) ? $value : 'payment_date';
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }
}
