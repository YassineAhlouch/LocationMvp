<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Enums\FuelType;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationChangeType;
use App\Enums\ReservationStatus;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarExpense;
use App\Models\CarImage;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\ReservationChange;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FleetManagementTest extends TestCase
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

    private function brand(array $attributes = []): Brand
    {
        return Brand::factory()->create($attributes);
    }

    private function category(array $attributes = []): CarCategory
    {
        return CarCategory::factory()->create($attributes);
    }

    private function client(): Client
    {
        return Client::factory()->create(['agency_id' => $this->agency->id]);
    }

    private function car(array $attributes = []): Car
    {
        $brand = $this->brand();
        $model = CarModel::factory()->create(['brand_id' => $brand->id]);

        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'category_id' => $this->category()->id,
            'daily_price' => 300,
            'status' => CarStatus::Available,
        ], $attributes));
    }

    /**
     * Always pairs brand/model/category so the model-brands-brand rule holds.
     *
     * @return array<string, mixed>
     */
    private function storePayload(Brand $brand, CarModel $model, CarCategory $category, array $overrides = []): array
    {
        return array_merge([
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'category_id' => $category->id,
            'registration_number' => 'ABC-123-45',
            'daily_price' => 300,
            'year' => 2022,
            'seats_count' => 5,
            'transmission_type' => 'manual',
            'fuel_type' => 'petrol',
        ], $overrides);
    }

    public function test_index_requires_permission_and_shapes_the_resource(): void
    {
        $outsider = $this->actor(['reservations.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/cars')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'fleet.view');

        $actor = $this->actor(['fleet.view']);
        $this->car(['registration_number' => 'AAA-001', 'daily_price' => 200]);
        $second = $this->car(['registration_number' => 'AAA-002']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.registration_number', 'AAA-002')
            ->assertJsonPath('data.1.registration_number', 'AAA-001')
            ->assertJsonPath('data.1.status', 'available')
            ->assertJsonPath('data.1.daily_price', 200)
            ->assertJsonPath('data.1.images_count', 0)
            ->assertJsonPath('meta.total', 2);

        // brand/model/category are embedded objects, not raw ids.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?q=AAA-002')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $second->id)
            ->assertJsonPath('data.0.brand.name', $second->brand->name);
    }

    public function test_index_is_tenant_scoped(): void
    {
        $actor = $this->actor(['fleet.view']);
        $foreign = Car::factory()->create([
            'agency_id' => Agency::factory(),
            'registration_number' => 'ZZZ-999',
            'daily_price' => 300,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$foreign->id)
            ->assertNotFound();
    }

    public function test_search_finds_by_registration_and_brand_name(): void
    {
        $actor = $this->actor(['fleet.view']);
        $renault = $this->brand(['name' => 'Renault']);
        $renaultModel = CarModel::factory()->create(['brand_id' => $renault->id, 'name' => 'Clio']);
        $dacia = $this->brand(['name' => 'Dacia']);
        $duster = CarModel::factory()->create(['brand_id' => $dacia->id, 'name' => 'Duster']);

        $clio = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $renault->id,
            'model_id' => $renaultModel->id,
            'category_id' => $this->category()->id,
            'registration_number' => 'ABC-111',
            'daily_price' => 300,
        ]);
        Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $dacia->id,
            'model_id' => $duster->id,
            'category_id' => $this->category()->id,
            'registration_number' => 'XYZ-222',
            'daily_price' => 250,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?q=ABC-11')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $clio->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?q=Renault')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $clio->id);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?q=Duster')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_filters_and_sorting_are_supported(): void
    {
        $actor = $this->actor(['fleet.view']);
        $luxury = $this->category(['name' => 'Luxury']);
        $economy = $this->category(['name' => 'Economy']);

        $this->car([
            'registration_number' => 'FIL-A',
            'category_id' => $luxury->id,
            'status' => CarStatus::Maintenance,
            'fuel_type' => FuelType::Diesel,
            'daily_price' => 150,
        ]);
        $this->car([
            'registration_number' => 'FIL-B',
            'category_id' => $economy->id,
            'status' => CarStatus::Inactive,
            'fuel_type' => FuelType::Petrol,
            'is_active' => false,
            'daily_price' => 600,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?status=maintenance')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.registration_number', 'FIL-A');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?category_id='.$luxury->id.'&fuel_type=diesel')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        // is_active=false arrives as a real boolean, not the string "false".
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?is_active=false')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.registration_number', 'FIL-B');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?sort_by=daily_price&sort_dir=asc')
            ->assertOk()
            ->assertJsonPath('data.0.registration_number', 'FIL-A')
            ->assertJsonPath('data.1.registration_number', 'FIL-B');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars?sort_by=password')
            ->assertStatus(422);
    }

    public function test_store_creates_full_car_with_gallery_and_logs(): void
    {
        $actor = $this->actor(['fleet.*']);
        $brand = $this->brand(['name' => 'Renault']);
        $model = CarModel::factory()->create(['brand_id' => $brand->id, 'name' => 'Clio']);
        $category = $this->category(['name' => 'Economy']);

        $response = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($brand, $model, $category, [
                'images' => [
                    ['image' => 'cars/photo-a.jpg'],
                    ['image' => 'cars/photo-b.jpg', 'is_primary' => true],
                ],
            ]));

        $response->assertCreated()
            ->assertJsonPath('registration_number', 'ABC-123-45')
            ->assertJsonPath('status', 'available')
            ->assertJsonPath('brand.name', 'Renault')
            ->assertJsonPath('model.name', 'Clio')
            ->assertJsonPath('category.name', 'Economy')
            ->assertJsonPath('daily_price', 300)
            ->assertJsonPath('images.0.image', 'cars/photo-a.jpg')
            ->assertJsonPath('images.0.is_primary', false)
            ->assertJsonPath('images.1.image', 'cars/photo-b.jpg')
            ->assertJsonPath('images.1.is_primary', true);

        $id = $response->json('id');

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'fleet',
            'action' => 'created',
            'entity_type' => Car::class,
            'entity_id' => $id,
            'user_id' => $actor->id,
        ]);

        $creation = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('action', 'created')
            ->where('entity_id', $id)
            ->firstOrFail();

        $this->assertSame('available', $creation->new_values['status']);
        $this->assertSame('ABC-123-45', $creation->new_values['registration_number']);
    }

    public function test_store_enforces_brand_model_pairing_and_accepts_statuses(): void
    {
        $actor = $this->actor(['fleet.*']);
        $renault = $this->brand(['name' => 'Renault']);
        $dacia = $this->brand(['name' => 'Dacia']);
        $duster = CarModel::factory()->create(['brand_id' => $dacia->id, 'name' => 'Duster']);
        $category = $this->category(['name' => 'SUV']);

        // A Renault car cannot be built on a Dacia model.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($renault, $duster, $category))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['model_id']);

        // The full lifecycle status set (including reserved/rented) is accepted
        // so an existing car's state round-trips through the edit form.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($renault, CarModel::factory()->create(['brand_id' => $renault->id]), $category, [
                'registration_number' => 'ABC-222',
                'status' => CarStatus::Rented->value,
            ]))
            ->assertCreated()
            ->assertJsonPath('status', CarStatus::Rented->value);

        // registration_number is globally unique, including across soft
        // deletes (a plate is the vehicle's physical identity).
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($renault, CarModel::factory()->create(['brand_id' => $renault->id]), $category))
            ->assertCreated();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($renault, CarModel::factory()->create(['brand_id' => $renault->id]), $category))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['registration_number']);
    }

    public function test_show_includes_gallery_and_scoping(): void
    {
        $actor = $this->actor(['fleet.*']);
        $brand = $this->brand(['name' => 'Dacia']);
        $model = CarModel::factory()->create(['brand_id' => $brand->id, 'name' => 'Duster']);

        $car = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'category_id' => $this->category()->id,
            'registration_number' => 'SHW-001',
            'daily_price' => 300,
        ]);
        CarImage::factory()->create([
            'car_id' => $car->id,
            'image' => 'cars/main.jpg',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$car->id)
            ->assertOk()
            ->assertJsonPath('registration_number', 'SHW-001')
            ->assertJsonPath('brand.name', 'Dacia')
            ->assertJsonPath('images_count', 1)
            ->assertJsonPath('images.0.image', 'cars/main.jpg')
            ->assertJsonPath('images.0.is_primary', true);

        $foreign = Car::factory()->create(['agency_id' => Agency::factory(), 'registration_number' => 'SHW-999']);
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$foreign->id)
            ->assertNotFound();
    }

    public function test_update_replaces_gallery_and_logs_field_diffs(): void
    {
        $actor = $this->actor(['fleet.*']);
        $brand = $this->brand(['name' => 'Peugeot']);
        $model = CarModel::factory()->create(['brand_id' => $brand->id, 'name' => '208']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($brand, $model, $this->category(), [
                'color' => 'Red',
                'images' => [
                    ['image' => 'cars/old-1.jpg', 'is_primary' => true],
                    ['image' => 'cars/old-2.jpg'],
                ],
            ]))
            ->assertCreated()->json('id');

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/cars/'.$id, [
                'color' => 'Blue',
                'images' => [
                    ['image' => 'cars/new-1.jpg'],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('color', 'Blue')
            ->assertJsonPath('images_count', 1)
            ->assertJsonPath('images.0.image', 'cars/new-1.jpg')
            ->assertJsonPath('images.0.is_primary', true);

        $this->assertDatabaseCount('car_images', 1);
        $this->assertDatabaseHas('car_images', ['car_id' => $id, 'image' => 'cars/new-1.jpg', 'is_primary' => 1]);

        $updated = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('action', 'updated')
            ->where('entity_id', $id)
            ->orderBy('id')
            ->firstOrFail();

        $this->assertSame('Red', $updated->old_values['color']);
        $this->assertSame('Blue', $updated->new_values['color']);
    }

    public function test_update_enforces_brand_model_pairing(): void
    {
        $actor = $this->actor(['fleet.*']);
        $renault = $this->brand(['name' => 'Renault']);
        $clio = CarModel::factory()->create(['brand_id' => $renault->id, 'name' => 'Clio']);
        $dacia = $this->brand(['name' => 'Dacia']);
        $duster = CarModel::factory()->create(['brand_id' => $dacia->id, 'name' => 'Duster']);
        $category = $this->category(['name' => 'Economy']);

        $id = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/cars', $this->storePayload($renault, $clio, $category))
            ->assertCreated()->json('id');

        // A valid update carrying model_id passes — regression guard for the
        // model-brands-brand check querying the wrong column (`key`).
        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/cars/'.$id, [
                'brand_id' => $renault->id,
                'model_id' => $clio->id,
                'daily_price' => 350,
            ])
            ->assertOk()
            ->assertJsonPath('daily_price', 350);

        // A Renault car cannot be moved onto a Dacia model.
        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/cars/'.$id, [
                'brand_id' => $renault->id,
                'model_id' => $duster->id,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['model_id']);
    }

    public function test_destroy_soft_deletes_and_is_blocked_by_reservations(): void
    {
        $actor = $this->actor(['fleet.*']);
        $client = $this->client();

        // A car with a reservation is retired, not deleted.
        $booked = $this->car(['registration_number' => 'BOOK-01']);
        Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $booked->id,
            'primary_client_id' => $client->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/cars/'.$booked->id)
            ->assertStatus(409)
            ->assertJsonPath('code', 'car_has_reservations');

        $this->assertDatabaseHas('cars', ['id' => $booked->id, 'deleted_at' => null]);

        // An unbooked car soft-deletes and leaves the tenant surface.
        $free = $this->car(['registration_number' => 'FREE-01']);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/cars/'.$free->id)
            ->assertNoContent();

        $this->assertSoftDeleted('cars', ['id' => $free->id]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.registration_number', 'BOOK-01');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$free->id)
            ->assertNotFound();

        $deleted = ActivityLog::query()
            ->where('module', 'fleet')
            ->where('action', 'deleted')
            ->where('entity_id', $free->id)
            ->firstOrFail();

        $this->assertSame('available', $deleted->old_values['status']);
    }

    public function test_overview_requires_permission_and_summarises_a_cars_financials(): void
    {
        $outsider = $this->actor(['reservations.view']);
        $car = $this->car(['registration_number' => 'OVR-001']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/cars/'.$car->id.'/overview')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'fleet.view');

        $actor = $this->actor(['fleet.view']);
        $client = $this->client();

        $active = Reservation::factory()->active()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
            'rental_days' => 4,
            'total_amount' => 1200,
        ]);
        Reservation::factory()->completed()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
            'rental_days' => 3,
            'total_amount' => 900,
        ]);
        Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
            'rental_days' => 5,
            'status' => ReservationStatus::Cancelled,
            'total_amount' => 1500,
        ]);

        foreach ([
            [500, PaymentRecordStatus::Paid],
            [200, PaymentRecordStatus::Pending],
            [100, PaymentRecordStatus::Refunded],
        ] as [$amount, $status]) {
            Payment::factory()->create([
                'agency_id' => $this->agency->id,
                'reservation_id' => $active->id,
                'amount' => $amount,
                'status' => $status,
                'payment_date' => now(),
            ]);
        }

        CarExpense::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'type' => ExpenseType::Maintenance,
            'amount' => 300,
            'status' => ExpenseStatus::Paid,
            'paid_date' => now(),
        ]);
        CarExpense::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'type' => ExpenseType::Repair,
            'amount' => 150,
            'status' => ExpenseStatus::Pending,
            'due_date' => now()->subDay(),
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$car->id.'/overview')
            ->assertOk()
            ->assertJsonPath('stats.reservations.total', 3)
            ->assertJsonPath('stats.reservations.active', 1)
            ->assertJsonPath('stats.reservations.booked_days', 7)
            ->assertJsonPath('stats.revenue.paid', 500)
            ->assertJsonPath('stats.revenue.pending', 200)
            ->assertJsonPath('stats.revenue.refunded', 100)
            ->assertJsonPath('stats.revenue.net', 400)
            ->assertJsonPath('stats.expenses.paid', 300)
            ->assertJsonPath('stats.expenses.pending', 150)
            ->assertJsonPath('stats.expenses.total', 450)
            ->assertJsonPath('stats.expenses.overdue_count', 1)
            ->assertJsonPath('stats.expenses.by_type.0.type', 'maintenance')
            ->assertJsonPath('stats.expenses.by_type.0.amount', 300)
            ->assertJsonPath('stats.net', -50)
            ->assertJsonCount(12, 'stats.timeline.labels')
            ->assertJsonCount(3, 'recent_reservations')
            ->assertJsonCount(2, 'recent_expenses');

        $foreign = Car::factory()->create([
            'agency_id' => Agency::factory(),
            'registration_number' => 'OVR-999',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$foreign->id.'/overview')
            ->assertNotFound();
    }

    public function test_history_merges_car_activity_and_reservation_changes(): void
    {
        $outsider = $this->actor(['reservations.view']);
        $car = $this->car(['registration_number' => 'HIS-001']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/cars/'.$car->id.'/history')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'fleet.view');

        $actor = $this->actor(['fleet.view']);
        $client = $this->client();

        $reservation = Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
        ]);

        ReservationChange::factory()->create([
            'reservation_id' => $reservation->id,
            'created_by' => $actor->id,
            'change_type' => ReservationChangeType::Extension,
        ]);

        // Changes on another car's reservation must never leak in.
        $otherCar = $this->car(['registration_number' => 'HIS-002']);
        $otherReservation = Reservation::factory()->create([
            'agency_id' => $this->agency->id,
            'car_id' => $otherCar->id,
            'primary_client_id' => $client->id,
            'created_by' => $actor->id,
        ]);
        ReservationChange::factory()->create([
            'reservation_id' => $otherReservation->id,
            'created_by' => $actor->id,
        ]);

        ActivityLog::create([
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
            'module' => 'fleet',
            'action' => 'updated',
            'entity_type' => Car::class,
            'entity_id' => $car->id,
            'description' => 'Car updated',
        ]);

        $response = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$car->id.'/history')
            ->assertOk()
            ->assertJsonCount(2);

        $entries = collect($response->json());

        $carEntry = $entries->firstWhere('source', 'car');
        $this->assertNotNull($carEntry);
        $this->assertSame('updated', $carEntry['action']);
        $this->assertSame($actor->full_name, $carEntry['user']['full_name']);

        $reservationEntry = $entries->firstWhere('source', 'reservation');
        $this->assertNotNull($reservationEntry);
        $this->assertSame('extension', $reservationEntry['change_type']);
        $this->assertSame($reservation->id, $reservationEntry['reservation']['id']);
        $this->assertSame($reservation->reservation_number, $reservationEntry['reservation']['reservation_number']);
        $this->assertSame($actor->full_name, $reservationEntry['user']['full_name']);

        $foreign = Car::factory()->create([
            'agency_id' => Agency::factory(),
            'registration_number' => 'HIS-999',
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/cars/'.$foreign->id.'/history')
            ->assertNotFound();
    }
}
