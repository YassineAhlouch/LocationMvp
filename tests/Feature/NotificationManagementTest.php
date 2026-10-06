<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationManagementTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create();
    }

    private function actor(array $permissions): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    private function userInAgency(): User
    {
        $role = Role::factory()->create(['permissions' => ['notifications.view']]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    private function car(): Car
    {
        $brand = Brand::factory()->create();
        $model = CarModel::factory()->create(['brand_id' => $brand->id]);

        return Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
        ]);
    }

    private function reservation(): Reservation
    {
        return Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $this->car()->id,
            'primary_client_id' => Client::factory()->create(['agency_id' => $this->agency->id])->id,
        ]);
    }

    /**
     * Insert a notification row for a fixture user (DatabaseNotification does
     * not auto-generate its uuid — mirror the dispatcher).
     *
     * @return DatabaseNotification
     */
    private function notify(User $user, array $data, ?string $readAt = null, string $type = 'announcement')
    {
        return $user->notifications()->create([
            'id' => (string) Str::uuid(),
            'type' => $type,
            'data' => $data,
            'read_at' => $readAt,
            'created_at' => $data['created_at'] ?? now(),
        ]);
    }

    public function test_inbox_requires_notifications_view(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'notifications.view');

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertStatus(403);

        $this->actingAs($outsider, 'sanctum')
            ->postJson('/api/v1/notifications/read-all')
            ->assertStatus(403);
    }

    public function test_index_returns_feed_unread_first(): void
    {
        $user = $this->userInAgency();

        // A READ notification that is NEWER must still sort below an unread one.
        $this->notify($user, ['title' => 'Older unread', 'created_at' => now()->subMinutes(10)]);
        $this->notify($user, ['title' => 'Newer already read'], now()->toDateTimeString());
        $read = $user->notifications()->whereNotNull('read_at')->latest()->first();
        $read->update(['created_at' => now()->subMinutes(5)]);
        $this->notify($user, ['title' => 'Payment landed', 'created_at' => now()], null, 'payment');

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.type', 'payment')
            ->assertJsonPath('data.0.read', false)
            ->assertJsonPath('data.1.type', 'announcement')
            ->assertJsonPath('data.1.read', false)
            ->assertJsonPath('data.2.read', true)
            ->assertJsonStructure(['meta' => ['current_page', 'per_page', 'total']]);
    }

    public function test_unread_count_and_mark_read_are_scoped_and_idempotent(): void
    {
        $user = $this->userInAgency();
        $other = $this->userInAgency();

        $unread = $this->notify($user, ['title' => 'Hello']);
        $foreign = $this->notify($other, ['title' => 'Not yours']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertJsonPath('unread_count', 1);

        // Someone else's notification is not findable through my inbox.
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notifications/read/'.$foreign->id)
            ->assertNotFound();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notifications/read/'.$unread->id)
            ->assertOk()
            ->assertJsonPath('read', true);

        // Idempotent second read.
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notifications/read/'.$unread->id)
            ->assertOk()
            ->assertJsonPath('read', true);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications/unread-count')
            ->assertJsonPath('unread_count', 0);
    }

    public function test_read_all_clears_the_inbox(): void
    {
        $user = $this->userInAgency();

        $this->notify($user, ['title' => 'A']);
        $this->notify($user, ['title' => 'B']);
        $this->notify($user, ['title' => 'C'], now()->toDateTimeString());

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/notifications/read-all')
            ->assertOk()
            ->assertJsonPath('marked_count', 2)
            ->assertJsonPath('unread_count', 0);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('data.0.read', true)
            ->assertJsonPath('data.1.read', true)
            ->assertJsonPath('data.2.read', true);
    }

    public function test_send_requires_notifications_send(): void
    {
        $viewer = $this->actor(['notifications.view']);

        $this->actingAs($viewer, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Holiday',
                'body' => 'Office closed Friday',
                'send_to_all' => true,
            ])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'notifications.send');
    }

    public function test_announcement_to_users_roles_and_everyone(): void
    {
        $sender = $this->actor(['notifications.*']);

        $bob = $this->userInAgency();
        $alice = $this->userInAgency();
        $inactive = $this->userInAgency();
        $inactive->update(['is_active' => false]);

        $foreignAgency = Agency::factory()->create();
        $foreignRole = Role::factory()->create(['permissions' => ['notifications.view']]);
        $foreign = User::factory()->create([
            'agency_id' => $foreignAgency->id,
            'role_id' => $foreignRole->id,
        ]);

        // Targeted users.
        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Team notice',
                'body' => 'Please log your hours',
                'user_ids' => [$bob->id, $alice->id, $inactive->id],
            ])
            ->assertCreated()
            ->assertJsonPath('sent', 2); // inactive excluded silently

        $this->assertSame(1, $bob->unreadNotifications()->where('type', 'announcement')->count());
        $this->assertSame(0, $inactive->unreadNotifications()->count());

        // Foreign user cannot be addressed — 422 at validation.
        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Leak',
                'body' => 'Cross agency',
                'user_ids' => [$foreign->id],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['user_ids.0']);

        // Audience must be unambiguous.
        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Ambiguous',
                'body' => 'Which audience?',
                'send_to_all' => true,
                'user_ids' => [$bob->id],
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['audience']);

        // By role: every active user holding the role in this agency.
        $managers = Role::factory()->create(['permissions' => ['notifications.view']]);
        $m1 = $this->userInAgency();
        $m2 = $this->userInAgency();
        $m1->update(['role_id' => $managers->id]);
        $m2->update(['role_id' => $managers->id]);

        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Managers only',
                'body' => 'Budget review at 4pm',
                'role_ids' => [$managers->id],
            ])
            ->assertCreated()
            ->assertJsonPath('sent', 2);

        $this->assertSame(1, $m1->unreadNotifications()->count());
        $this->assertSame('Managers only', $m1->unreadNotifications()->firstOrFail()->data['title']);

        // Everyone: all active users of the agency.
        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'All hands',
                'body' => 'Fire drill tomorrow',
                'send_to_all' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('sent', User::query()->where('agency_id', $this->agency->id)->where('is_active', true)->count());
    }

    public function test_announcement_is_audited(): void
    {
        $sender = $this->actor(['notifications.*']);
        $bob = $this->userInAgency();

        $this->actingAs($sender, 'sanctum')
            ->postJson('/api/v1/notifications', [
                'title' => 'Audited',
                'body' => 'This gets a log row',
                'user_ids' => [$bob->id],
            ])
            ->assertCreated();

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'notifications',
            'action' => 'sent',
            'entity_type' => User::class,
            'entity_id' => $sender->id,
            'agency_id' => $this->agency->id,
            'user_id' => $sender->id,
        ]);
    }

    public function test_payment_event_notifies_permission_holders_excluding_the_actor(): void
    {
        $managerRole = Role::factory()->create(['permissions' => ['payments.view', 'notifications.view']]);
        $adminRole = Role::factory()->create(['permissions' => ['*', 'notifications.view']]);
        $agentRole = Role::factory()->create(['permissions' => ['payments.create', 'notifications.view']]);

        $manager = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $managerRole->id]);
        $admin = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $adminRole->id]);
        $agent = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $agentRole->id]);

        $reservation = $this->reservation();

        $this->actingAs($agent, 'sanctum')
            ->postJson('/api/v1/reservations/'.$reservation->id.'/payments', [
                'amount' => 250,
                'method' => 'cash',
            ])
            ->assertCreated()
            ->assertJsonPath('amount', 250);

        // Everyone who can see payments knows — including the '*' admin —
        // but the agent who recorded it does not get their own echo.
        $this->assertSame(1, $manager->unreadNotifications()->where('type', 'payment')->count());
        $this->assertSame(1, $admin->unreadNotifications()->where('type', 'payment')->count());
        $this->assertSame(0, $agent->unreadNotifications()->count());

        $notification = $manager->unreadNotifications()->where('type', 'payment')->firstOrFail();
        $this->assertSame($reservation->reservation_number, $notification->data['reservation_number']);
        $this->assertEqualsWithDelta(250, $notification->data['amount'], 0.01);
        $this->assertSame('cash', $notification->data['method']);
    }
}
