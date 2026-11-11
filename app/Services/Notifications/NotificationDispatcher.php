<?php

namespace App\Services\Notifications;

use App\Models\Car;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * In-app notification engine. Writes Laravel database-notification rows for
 * the agency's users (the `notifications` table is per-notifiable, so it
 * needs no agency_id — your inbox is yours alone, and the agency boundary is
 * enforced at recipient-selection time instead).
 *
 * Delivery routing:
 *  - announcements are addressed explicitly (users, roles, or everyone);
 *  - system events go to everyone who holds the permission to act on them,
 *    always excluding the user who triggered the event — the people who can
 *    fix a thing are the people who get told.
 */
final class NotificationDispatcher
{
    /**
     * Compose an announcement for the chosen audience. Recipient selection
     * is always agency-scoped relative to the sender.
     *
     * @param  array{send_to_all: bool, user_ids?: array<int>, role_ids?: array<int>}  $audience
     */
    public function announcement(User $sender, string $title, string $body, array $audience): int
    {
        $recipients = collect()
            ->when($audience['send_to_all'], fn ($users) => $users->concat($this->activeUsers($sender->agency_id)))
            ->when($audience['user_ids'] ?? null, fn ($users, $ids) => $users->concat(
                User::whereKey($ids)->where('is_active', true)->get(),
            ))
            ->when(
                $audience['role_ids'] ?? null,
                fn ($users, $ids) => $users->concat($this->activeUsersByRole($sender->agency_id, $ids)),
            )
            ->unique('id');

        $data = [
            'title' => $title,
            'body' => $body,
            'sent_by' => [
                'id' => $sender->id,
                'first_name' => $sender->first_name,
                'last_name' => $sender->last_name,
            ],
        ];

        $recipients->each(fn (User $user) => $this->insert($user, 'announcement', $data));

        return $recipients->count();
    }

    /**
     * "Money landed" is the one business event worth shouting about: everyone
     * with payments.view learns about it — except whoever recorded it.
     */
    public function paymentRecorded(Payment $payment, User $actor): int
    {
        return $this->notifyPermissionHolders('payments.view', $actor, 'payment', [
            'reservation_id' => $payment->reservation_id,
            'reservation_number' => $payment->reservation->reservation_number,
            'amount' => (float) $payment->amount,
            'method' => $payment->method?->value,
        ]);
    }

    /**
     * Fleet document alerts. Like payments, they go to the people who can
     * act on them — fleet.update holders, i.e. the ones who record the
     * renewal expense. There is no triggering actor (the scheduler calls),
     * so nobody is excluded; each alert carries the expiry date and the
     * decay stage so the frontend can phrase urgency.
     */
    public function carInsuranceExpiring(Car $car, Carbon $expiry, int $daysLeft, string $stage): int
    {
        return $this->carExpiryAlert($car, 'car_insurance', $expiry, $daysLeft, $stage);
    }

    public function carInspectionExpiring(Car $car, Carbon $expiry, int $daysLeft, string $stage): int
    {
        return $this->carExpiryAlert($car, 'car_inspection', $expiry, $daysLeft, $stage);
    }

    /**
     * A return landed with the tank at or below the low-fuel threshold. The
     * actor (whoever completed the return) already knows — everyone else who
     * can refuel the car is told.
     */
    public function carFuelLow(Car $car, int $fuelLevel, Reservation $reservation, ?User $actor = null): int
    {
        $data = [
            'car_id' => $car->id,
            'car_label' => $this->carLabel($car),
            'registration_number' => $car->registration_number,
            'fuel_level' => $fuelLevel,
            'reservation_id' => $reservation->id,
            'reservation_number' => $reservation->reservation_number,
        ];

        $recipients = $this->fleetHolders($car->agency_id)
            ->reject(fn (User $user) => $user->id === $actor?->id);

        $recipients->each(fn (User $user) => $this->insert($user, 'car_fuel', $data));

        return $recipients->count();
    }

    private function carExpiryAlert(Car $car, string $type, Carbon $expiry, int $daysLeft, string $stage): int
    {
        // One row per car, document, expiry date, and stage: the daily sweep
        // replays while a document stays inside the window, but never sends
        // the same alert twice. Recording a renewal changes the expiry date,
        // which naturally starts a fresh cycle.
        $alreadySent = DatabaseNotification::query()
            ->where('type', $type)
            ->where('data->car_id', $car->id)
            ->where('data->expiry_date', $expiry->toDateString())
            ->where('data->stage', $stage)
            ->exists();

        if ($alreadySent) {
            return 0;
        }

        $data = [
            'car_id' => $car->id,
            'car_label' => $this->carLabel($car),
            'registration_number' => $car->registration_number,
            'expiry_date' => $expiry->toDateString(),
            'days_left' => $daysLeft,
            'stage' => $stage,
        ];

        $recipients = $this->fleetHolders($car->agency_id);

        $recipients->each(fn (User $user) => $this->insert($user, $type, $data));

        return $recipients->count();
    }

    /**
     * Everyone in the agency who can act on a car: record the renewal
     * expense, refuel, book the inspection.
     *
     * @return Collection<int, User>
     */
    private function fleetHolders(int $agencyId): Collection
    {
        return User::query()
            ->where('agency_id', $agencyId)
            ->where('is_active', true)
            ->get()
            ->filter(fn (User $user) => $user->hasPermission('fleet.update'));
    }

    private function carLabel(Car $car): string
    {
        return trim(($car->brand?->name ?? '').' '.($car->model?->name ?? ''));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function notifyPermissionHolders(string $permission, User $except, string $type, array $data): int
    {
        $recipients = $this->activeUsers($except->agency_id)
            ->reject(fn (User $user) => $user->id === $except->id)
            ->filter(fn (User $user) => $user->hasPermission($permission));

        $recipients->each(fn (User $user) => $this->insert($user, $type, $data));

        return $recipients->count();
    }

    /**
     * @return Collection<int, User>
     */
    private function activeUsers(int $agencyId): Collection
    {
        return User::query()
            ->where('agency_id', $agencyId)
            ->where('is_active', true)
            ->get();
    }

    /**
     * @param  array<int>  $roleIds
     * @return Collection<int, User>
     */
    private function activeUsersByRole(int $agencyId, array $roleIds): Collection
    {
        return User::query()
            ->where('agency_id', $agencyId)
            ->whereIn('role_id', $roleIds)
            ->where('is_active', true)
            ->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function insert(User $user, string $type, array $data): void
    {
        $user->notifications()->create([
            // DatabaseNotification does not auto-generate its uuid in this
            // Laravel version — the framework's own DatabaseChannel passes it
            // explicitly, and so do we.
            'id' => (string) Str::uuid(),
            'type' => $type,
            'data' => $data,
        ]);
    }
}
