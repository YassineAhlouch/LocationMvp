<?php

namespace App\Services\Reservations;

use App\Enums\PaymentStatus;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\ReservationChange;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

/**
 * Read side of the reservation module: filters, eager loads, stable order.
 * The agency global scope applies automatically (BelongsToAgency), so this
 * service can never leak another agency's rows.
 */
class ReservationQueryService
{
    /**
     * Columns the list may be ordered by. Whitelisted here AND in the Form
     * Request — an unbounded orderBy from user input would be an injection
     * vector.
     */
    private const SORTABLE = [
        'pickup_datetime',
        'expected_return_datetime',
        'created_at',
        'total_amount',
        'status',
    ];

    /**
     * @param  array{
     *     status?: string,
     *     payment_status?: string,
     *     car_id?: int,
     *     client_id?: int,
     *     pickup_from?: string,
     *     pickup_to?: string,
     *     q?: string,
     *     sort_by?: string,
     *     sort_dir?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Reservation::query()
            ->with([
                'car:id,registration_number,daily_price',
                'primaryClient:id,first_name,last_name,phone',
                'secondaryClient:id,first_name,last_name,phone',
                'createdBy:id,first_name,last_name',
                'approvedBy:id,first_name,last_name',
                'extras',
            ])
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', ReservationStatus::from($status)))
            ->when($filters['payment_status'] ?? null, fn ($query, $paymentStatus) => $query->where('payment_status', PaymentStatus::from($paymentStatus)))
            ->when($filters['car_id'] ?? null, fn ($query, $carId) => $query->where('car_id', $carId))
            ->when($filters['client_id'] ?? null, function ($query, $clientId) {
                $query->where(fn ($builder) => $builder
                    ->where('primary_client_id', $clientId)
                    ->orWhere('secondary_client_id', $clientId));
            })
            ->when($filters['pickup_from'] ?? null, fn ($query, $from) => $query->where('pickup_datetime', '>=', $from))
            ->when($filters['pickup_to'] ?? null, fn ($query, $to) => $query->where('pickup_datetime', '<=', $to))
            ->when($filters['q'] ?? null, fn ($query, $term) => self::applySearch($query, $term))
            ->orderBy(self::sortBy($filters['sort_by'] ?? null), self::sortDir($filters['sort_dir'] ?? null))
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * Calendar feed: reservations whose rental window overlaps [from, to].
     * Overlap is `pickup <= to AND expected_return >= from`, so a rental
     * that started before the window but returns inside it is still drawn.
     * With no bounds the whole agency schedule is returned, ordered by
     * pickup so the calendar can render any month in one round-trip.
     *
     * @param  array{from?: string, to?: string}  $filters
     * @return Collection<int, Reservation>
     */
    public function calendar(array $filters): Collection
    {
        return Reservation::query()
            ->with([
                'car:id,registration_number',
                'primaryClient:id,first_name,last_name',
            ])
            ->when($filters['from'] ?? null, fn ($query, $from) => $query->where('expected_return_datetime', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, $to) => $query->where('pickup_datetime', '<=', $to))
            ->orderBy('pickup_datetime')
            ->orderBy('id')
            ->get();
    }

    /**
     * Free-text search across the reservation itself, its primary client
     * and its car. Client and car are matched through correlated EXISTS
     * subqueries — never joins — so the outer row set stays untouched and
     * paginate()'s COUNT cannot be distorted by a 1:N path.
     */
    private static function applySearch($query, string $term): void
    {
        $like = '%'.trim($term).'%';

        $query->where(function ($builder) use ($like) {
            $builder->where('reservation_number', 'like', $like)
                ->orWhere('primary_driver_name', 'like', $like)
                ->orWhere('primary_driver_phone', 'like', $like)
                ->orWhere('primary_driver_cin', 'like', $like)
                ->orWhere(fn ($client) => $client->whereExists(
                    fn ($exists) => $exists->from('clients')
                        ->whereColumn('clients.id', 'reservations.primary_client_id')
                        ->where(fn ($name) => $name
                            ->where('clients.first_name', 'like', $like)
                            ->orWhere('clients.last_name', 'like', $like)
                            ->orWhere('clients.phone', 'like', $like)),
                ))
                ->orWhere(fn ($car) => $car->whereExists(
                    fn ($exists) => $exists->from('cars')
                        ->whereColumn('cars.id', 'reservations.car_id')
                        ->where('cars.registration_number', 'like', $like),
                ));
        });
    }

    private static function sortBy(?string $value): string
    {
        return in_array($value, self::SORTABLE, true) ? $value : 'pickup_datetime';
    }

    private static function sortDir(?string $value): string
    {
        return $value === 'asc' ? 'asc' : 'desc';
    }

    /**
     * Global changes feed: every field-level audit row across the agency,
     * newest first. reservation_changes carries no agency_id of its own —
     * the row is scoped through its reservation, so the EXISTS clause runs
     * Reservation's agency scope and the feed can never leak across
     * agencies.
     *
     * @param  array{
     *     reservation_id?: int,
     *     change_type?: string,
     *     field_name?: string,
     *     created_by?: int,
     *     from?: string,
     *     to?: string,
     *     per_page?: int,
     * }  $filters
     */
    public function paginateChanges(array $filters): LengthAwarePaginator
    {
        return ReservationChange::query()
            ->with(['reservation:id,reservation_number', 'createdBy:id,first_name,last_name'])
            ->whereHas('reservation')
            ->when($filters['reservation_id'] ?? null, fn ($query, $reservationId) => $query->where('reservation_id', $reservationId))
            ->when($filters['change_type'] ?? null, fn ($query, $type) => $query->where('change_type', ReservationChangeType::from($type)))
            ->when($filters['field_name'] ?? null, fn ($query, $field) => $query->where('field_name', $field))
            ->when($filters['created_by'] ?? null, fn ($query, $userId) => $query->where('created_by', $userId))
            ->when($filters['from'] ?? null, fn ($query, $from) => $query->where('created_at', '>=', Carbon::parse($from)))
            ->when($filters['to'] ?? null, fn ($query, $to) => $query->where('created_at', '<=', self::endOfBoundary($to)))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    /**
     * A date-only upper bound includes that whole day; a full datetime is
     * honoured as given.
     */
    private static function endOfBoundary(string $value): Carbon
    {
        $parsed = Carbon::parse($value);

        return $parsed->toDateString() === $value ? $parsed->endOfDay() : $parsed;
    }
}
