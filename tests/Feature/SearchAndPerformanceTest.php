<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class SearchAndPerformanceTest extends TestCase
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

    private function car(array $attributes = []): Car
    {
        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'daily_price' => 300,
            'status' => CarStatus::Available,
        ], $attributes));
    }

    private function client(array $attributes = []): Client
    {
        return Client::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
        ], $attributes));
    }

    /**
     * @return array<string, mixed>
     */
    private function storePayload(Car $car, Client $client, array $overrides = []): array
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return array_merge([
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'pickup_datetime' => $pickup->toDateTimeString(),
            'expected_return_datetime' => $pickup->copy()->addDays(4)->toDateTimeString(),
            'deposit_amount' => 1000,
        ], $overrides);
    }

    public function test_reservation_search_finds_client_car_and_driver_cin(): void
    {
        $actor = $this->actor(['reservations.*']);
        $carA = $this->car(['registration_number' => 'REG-000-AAA']);
        $carB = $this->car(['registration_number' => 'REG-777-BBB']);
        $clientAmrani = $this->client(['first_name' => 'Youssef', 'last_name' => 'Amrani', 'phone' => '0612345678']);
        $clientBenali = $this->client(['first_name' => 'Hassan', 'last_name' => 'Benali', 'phone' => '0698765432']);

        $idA = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($carA, $clientAmrani, [
                'primary_driver_name' => 'Karim',
                'primary_driver_cin' => 'CIN-889900',
                'primary_driver_phone' => '0666666666',
            ]))
            ->assertCreated()->json('id');

        $idB = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($carB, $clientBenali, [
                'primary_driver_name' => 'Said',
                'primary_driver_cin' => 'CIN-112233',
                'primary_driver_phone' => '0655555555',
            ]))
            ->assertCreated()->json('id');

        // By client name.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=Amrani')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idA);

        // By client phone.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=98765432')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idB);

        // By car registration (partial).
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=REG-777')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idB);

        // By driver CIN.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=889900')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idA);

        // By reservation number (the full number is unique; a too-short
        // prefix like "RES-20" legitimately matches every same-day booking).
        $numberA = Reservation::findOrFail($idA)->reservation_number;

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q='.$numberA)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idA);
    }

    public function test_reservation_search_combines_with_existing_filters(): void
    {
        $actor = $this->actor(['reservations.*']);
        $carA = $this->car(['registration_number' => 'REG-CMB-1']);
        $carB = $this->car(['registration_number' => 'REG-CMB-2']);
        $client = $this->client(['first_name' => 'Nadia', 'last_name' => 'Fassi']);
        $other = $this->client(['first_name' => 'Omar', 'last_name' => 'Ziani']);

        $idPending = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($carA, $client))
            ->assertCreated()->json('id');

        $idConfirmed = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($carB, $client))
            ->assertCreated()->json('id');

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/reservations/{$idConfirmed}/confirm")
            ->assertOk();

        // Same client books twice; q + status narrows to the pending one.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=Fassi&status=pending')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $idPending);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?q=Ziani')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_reservation_sorting_is_whitelisted_and_orderable(): void
    {
        $actor = $this->actor(['reservations.*']);
        $carA = $this->car(['registration_number' => 'REG-SRT-1']);
        $carB = $this->car(['registration_number' => 'REG-SRT-2']);
        $client = $this->client();

        // 4 days × 300 = 1440; 7 days × 300 = 2100.
        $cheap = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', $this->storePayload($carA, $client))
            ->assertCreated()->json('id');

        $pickup = now()->addDay()->setTime(9, 0);

        $pricey = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/reservations', [
                'car_id' => $carB->id,
                'primary_client_id' => $client->id,
                'pickup_datetime' => $pickup->toDateTimeString(),
                'expected_return_datetime' => $pickup->copy()->addDays(7)->toDateTimeString(),
                'deposit_amount' => 1000,
            ])
            ->assertCreated()->json('id');

        $ascending = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?sort_by=total_amount&sort_dir=asc');

        $ascending->assertOk()
            ->assertJsonPath('data.0.id', $cheap)
            ->assertJsonPath('data.1.id', $pricey);

        $descending = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?sort_by=total_amount&sort_dir=desc');

        $descending->assertOk()
            ->assertJsonPath('data.0.id', $pricey)
            ->assertJsonPath('data.1.id', $cheap);

        // Injection vector: unknown columns are rejected by the request.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?sort_by=password')
            ->assertStatus(422);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations?sort_dir=sideways')
            ->assertStatus(422);
    }

    public function test_reservation_list_does_not_lazy_load_relations(): void
    {
        $actor = $this->actor(['reservations.*']);

        foreach (range(1, 3) as $i) {
            $car = $this->car(['registration_number' => "REG-N1-{$i}"]);

            $id = $this->actingAs($actor, 'sanctum')
                ->postJson('/api/v1/reservations', $this->storePayload($car, $this->client()))
                ->assertCreated()->json('id');

            Reservation::whereKey($id)->update([
                'secondary_client_id' => $this->client()->id,
                'approved_by' => $actor->id,
            ]);
        }

        DB::enableQueryLog();

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reservations')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        // 1 count + 1 select + 6 eager loads (car, primary, secondary,
        // createdBy, approvedBy, extras). A per-row lazy load would blow this.
        $this->assertLessThanOrEqual(9, count(DB::getQueryLog()));
    }

    public function test_optimization_indexes_are_registered(): void
    {
        $changes = collect(Schema::getIndexes('reservation_changes'));

        $this->assertTrue(
            $changes->contains(fn (array $index) => in_array('reservation_id', $index['columns']) && in_array('created_at', $index['columns'])),
            'reservation_changes is missing its (reservation_id, created_at) index.',
        );
        $this->assertTrue(
            $changes->contains(fn (array $index) => in_array('change_type', $index['columns']) && in_array('created_at', $index['columns'])),
            'reservation_changes is missing its (change_type, created_at) index.',
        );

        $activity = collect(Schema::getIndexes('activity_logs'));

        $this->assertTrue(
            $activity->contains(fn (array $index) => in_array('entity_type', $index['columns']) && in_array('entity_id', $index['columns'])),
            'activity_logs is missing its (entity_type, entity_id) index.',
        );
    }
}
