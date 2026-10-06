<?php

namespace App\Services\Notifications;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
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
