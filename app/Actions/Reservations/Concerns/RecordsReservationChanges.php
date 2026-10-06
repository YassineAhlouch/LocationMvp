<?php

namespace App\Actions\Reservations\Concerns;

use App\Enums\ReservationChangeType;
use App\Models\Reservation;
use App\Models\ReservationChange;
use App\Models\User;
use Carbon\CarbonInterface;

/**
 * Audit-trail writer shared by every actor that mutates a reservation:
 * each business-meaningful write lands in reservation_changes with its old
 * value, new value, reason and the user who performed it.
 */
trait RecordsReservationChanges
{
    protected function recordChange(
        Reservation $reservation,
        string $field,
        ReservationChangeType $type,
        mixed $old,
        mixed $new,
        ?string $reason,
        User $actor,
    ): void {
        ReservationChange::create([
            'reservation_id' => $reservation->id,
            'field_name' => $field,
            'change_type' => $type,
            'old_value' => $this->normalizeChangeValue($old),
            'new_value' => $this->normalizeChangeValue($new),
            'reason' => $reason,
            'created_by' => $actor->id,
        ]);
    }

    protected function normalizeChangeValue(mixed $value): ?string
    {
        return match (true) {
            $value === null => null,
            $value instanceof CarbonInterface => $value->toDateTimeString(),
            is_bool($value) => $value ? '1' : '0',
            is_array($value) => json_encode($value, JSON_UNESCAPED_UNICODE),
            default => (string) $value,
        };
    }
}
