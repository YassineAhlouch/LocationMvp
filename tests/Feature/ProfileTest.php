<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create();
    }

    private function actor(array $permissions = []): User
    {
        $role = Role::factory()->create(['permissions' => $permissions]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
        ]);
    }

    public function test_profile_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/profile')->assertStatus(401);
        $this->patchJson('/api/v1/profile', ['first_name' => 'Nope'])->assertStatus(401);
        $this->patchJson('/api/v1/profile/password', [])->assertStatus(401);
    }

    public function test_a_user_reads_their_own_profile(): void
    {
        $user = $this->actor(['reservations.view']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/profile')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email);
    }

    public function test_a_user_updates_their_own_profile(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile', [
                'first_name' => 'Yassine',
                'last_name' => 'Ahlouch',
                'email' => 'yassine@example.com',
                'phone' => '0611223344',
            ])
            ->assertOk()
            ->assertJsonPath('first_name', 'Yassine')
            ->assertJsonPath('full_name', 'Yassine Ahlouch')
            ->assertJsonPath('email', 'yassine@example.com')
            ->assertJsonPath('phone', '0611223344');

        $user->refresh();
        $this->assertSame('Yassine', $user->first_name);
        $this->assertSame('yassine@example.com', $user->email);
    }

    public function test_a_user_cannot_take_another_users_email(): void
    {
        $owner = $this->actor();

        $this->actingAs($owner, 'sanctum')
            ->patchJson('/api/v1/profile', ['email' => $this->other()->email])
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');

        $this->assertNotSame('taken@example.com', $owner->refresh()->email);
    }

    public function test_a_user_may_keep_their_own_email(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile', ['email' => $user->email])
            ->assertOk()
            ->assertJsonPath('email', $user->email);
    }

    public function test_profile_update_ignores_privileged_fields(): void
    {
        $user = $this->actor(['reservations.view']);
        $privileged = Role::factory()->create(['permissions' => ['*']]);

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile', [
                'first_name' => 'Sami',
                'role_id' => $privileged->id,
                'is_active' => false,
            ])
            ->assertOk();

        $user->refresh();
        $this->assertSame('Sami', $user->first_name);
        $this->assertNotSame($privileged->id, $user->role_id);
        $this->assertTrue($user->is_active);
    }

    public function test_profile_update_is_written_to_the_activity_trail(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile', ['first_name' => 'Nadia'])
            ->assertOk();

        $log = ActivityLog::query()->latest('id')->firstOrFail();

        $this->assertSame('users', $log->module);
        $this->assertSame('updated', $log->action);
        $this->assertSame($user->id, $log->user_id);
        $this->assertSame('Nadia', $log->new_values['first_name'] ?? null);
    }

    public function test_password_can_be_changed_with_the_current_password(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile/password', [
                'current_password' => 'password',
                'password' => 'new-secret-1',
                'password_confirmation' => 'new-secret-1',
            ])
            ->assertOk();

        $this->assertTrue(Hash::check('new-secret-1', $user->refresh()->password));
    }

    public function test_password_change_rejects_a_wrong_current_password(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile/password', [
                'current_password' => 'not-my-password',
                'password' => 'new-secret-1',
                'password_confirmation' => 'new-secret-1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('current_password');

        $this->assertTrue(Hash::check('password', $user->refresh()->password));
    }

    public function test_password_change_requires_a_confirmation(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile/password', [
                'current_password' => 'password',
                'password' => 'new-secret-1',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('password');

        $this->assertTrue(Hash::check('password', $user->refresh()->password));
    }

    public function test_password_change_is_written_to_the_activity_trail(): void
    {
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->patchJson('/api/v1/profile/password', [
                'current_password' => 'password',
                'password' => 'new-secret-1',
                'password_confirmation' => 'new-secret-1',
            ])
            ->assertOk();

        $log = ActivityLog::query()->latest('id')->firstOrFail();

        $this->assertSame('users', $log->module);
        $this->assertSame('updated', $log->action);
        // The hash is a derived secret and must never appear in the diff.
        $this->assertNull($log->old_values);
        $this->assertNull($log->new_values);
    }

    public function test_avatar_upload_stores_the_file_and_returns_its_url(): void
    {
        Storage::fake('public');
        $user = $this->actor();

        $avatar = $this->actingAs($user, 'sanctum')
            ->post(
                '/api/v1/profile/avatar',
                ['file' => UploadedFile::fake()->image('me.jpg')],
                ['Accept' => 'application/json'],
            )
            ->assertOk()
            ->json('avatar');

        $this->assertStringStartsWith('/storage/avatars/', $avatar);
        $this->assertSame($avatar, $user->refresh()->avatar);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $avatar));
    }

    public function test_avatar_upload_rejects_a_non_image(): void
    {
        Storage::fake('public');
        $user = $this->actor();

        $this->actingAs($user, 'sanctum')
            ->post(
                '/api/v1/profile/avatar',
                ['file' => UploadedFile::fake()->create('contract.pdf', 10, 'application/pdf')],
                ['Accept' => 'application/json'],
            )
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');

        $this->assertNull($user->refresh()->avatar);
    }

    /**
     * A second staff member in the same agency, holding the email the first
     * one will try (and fail) to reuse.
     */
    private function other(): User
    {
        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'email' => 'taken@example.com',
        ]);
    }
}
