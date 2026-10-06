<?php

namespace Tests\Feature;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\CarModel;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseManagementTest extends TestCase
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
        $brand = Brand::factory()->create();
        $model = CarModel::factory()->create(['brand_id' => $brand->id]);

        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'daily_price' => 300,
        ], $attributes));
    }

    private function expense(Car $car, array $attributes = [], ?User $creator = null): CarExpense
    {
        return CarExpense::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'created_by' => ($creator ?? $this->actor([]))->id,
        ], $attributes));
    }

    public function test_index_requires_permission_and_shapes_the_resource(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/expenses')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'expenses.view');

        $actor = $this->actor(['expenses.view']);
        $car = $this->car(['registration_number' => 'EXP-001']);
        $this->expense($car, [
            'title' => 'Oil change',
            'amount' => 450.50,
            'status' => ExpenseStatus::Pending,
            'due_date' => now()->addWeek()->toDateString(),
        ], $actor);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.car.registration_number', 'EXP-001')
            ->assertJsonPath('data.0.title', 'Oil change')
            ->assertJsonPath('data.0.type', 'maintenance')
            ->assertJsonPath('data.0.amount', 450.5)
            ->assertJsonPath('data.0.status', 'pending')
            ->assertJsonPath('data.0.is_overdue', false)
            ->assertJsonPath('data.0.created_by.id', $actor->id);
    }

    public function test_index_status_filter_includes_derived_overdue(): void
    {
        $actor = $this->actor(['expenses.view']);
        $car = $this->car();

        $this->expense($car, ['title' => 'Paid bill', 'status' => ExpenseStatus::Paid, 'paid_date' => today()->toDateString()], $actor);
        $this->expense($car, ['title' => 'Upcoming bill', 'status' => ExpenseStatus::Pending, 'due_date' => now()->addWeek()->toDateString()], $actor);
        $this->expense($car, ['title' => 'Late bill', 'status' => ExpenseStatus::Pending, 'due_date' => now()->subWeek()->toDateString()], $actor);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?status=paid')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Paid bill');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?status=pending')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        // 'overdue' is a computed view: pending + due date in the past.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?status=overdue')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Late bill')
            ->assertJsonPath('data.0.is_overdue', true);

        // And the same view surfaces through the type + date-range filters.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?type=maintenance')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?due_from='.now()->subMonth()->toDateString().'&due_to='.today()->toDateString())
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Late bill');
    }

    public function test_search_finds_by_title_and_car_plate(): void
    {
        $actor = $this->actor(['expenses.view']);
        $car = $this->car(['registration_number' => 'PLATE-123']);
        $this->expense($car, ['title' => 'Insurance premium renewal'], $actor);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?q=premium')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        // Cross-table search resolves the registration via EXISTS, not a join.
        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses?q=PLATE-123')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.car.registration_number', 'PLATE-123');
    }

    public function test_index_is_tenant_scoped(): void
    {
        $actor = $this->actor(['expenses.view']);
        $foreign = CarExpense::factory()->create([
            'agency_id' => Agency::factory(),
            'car_id' => Car::factory()->create(['agency_id' => Agency::factory()])->id,
            'created_by' => User::factory()->create(['agency_id' => Agency::factory()])->id,
        ]);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses/'.$foreign->id)
            ->assertNotFound();
    }

    public function test_store_creates_expense_with_defaults_and_logs(): void
    {
        $actor = $this->actor(['expenses.*']);
        $car = $this->car(['registration_number' => 'NEW-001']);

        $created = $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => ExpenseType::Repair->value,
                'title' => 'Brake pads replacement',
                'amount' => 1200.00,
                'vendor' => 'Garage Atlas',
                'due_date' => now()->addDays(10)->toDateString(),
            ])
            ->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('type', 'repair')
            ->assertJsonPath('amount', 1200)
            ->assertJsonPath('car.registration_number', 'NEW-001')
            ->assertJsonPath('created_by.id', $actor->id);

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'expenses',
            'action' => 'created',
            'entity_type' => CarExpense::class,
            'entity_id' => $created->json('id'),
            'agency_id' => $this->agency->id,
            'user_id' => $actor->id,
        ]);

        // Overdue is derived, never storable.
        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => ExpenseType::Tax->value,
                'title' => 'Road tax',
                'amount' => 800.00,
                'status' => ExpenseStatus::Overdue->value,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        // A foreign or retired car cannot be billed.
        $foreignCar = Car::factory()->create(['agency_id' => Agency::factory()]);
        $trashedCar = $this->car();
        $trashedCar->delete();

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $foreignCar->id,
                'type' => ExpenseType::Tax->value,
                'title' => 'Bad car',
                'amount' => 100.00,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_id']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $trashedCar->id,
                'type' => ExpenseType::Tax->value,
                'title' => 'Bad car 2',
                'amount' => 100.00,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_id']);

        $this->actingAs($actor, 'sanctum')
            ->postJson('/api/v1/expenses', [
                'car_id' => $car->id,
                'type' => ExpenseType::Tax->value,
                'title' => 'Zero amount',
                'amount' => 0,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_update_marks_paid_and_logs_diff(): void
    {
        $actor = $this->actor(['expenses.*']);
        $car = $this->car();
        $expense = $this->expense($car, ['title' => 'Fix', 'status' => ExpenseStatus::Pending], $actor);

        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/expenses/'.$expense->id, [
                'status' => ExpenseStatus::Paid->value,
                'paid_date' => today()->toDateString(),
                'amount' => 900.25,
            ])
            ->assertOk()
            ->assertJsonPath('status', 'paid')
            ->assertJsonPath('paid_date', today()->toDateString())
            ->assertJsonPath('amount', 900.25)
            ->assertJsonPath('is_overdue', false);

        $updated = ActivityLog::query()
            ->where('module', 'expenses')
            ->where('action', 'updated')
            ->where('entity_id', $expense->id)
            ->firstOrFail();

        $this->assertSame('pending', $updated->old_values['status']);
        $this->assertSame('paid', $updated->new_values['status']);

        // Statuses are still constrained on update.
        $this->actingAs($actor, 'sanctum')
            ->patchJson('/api/v1/expenses/'.$expense->id, ['status' => ExpenseStatus::Overdue->value])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_show_includes_car_and_creator(): void
    {
        $actor = $this->actor(['expenses.view']);
        $car = $this->car(['registration_number' => 'SHOW-01']);
        $expense = $this->expense($car, ['title' => 'Tires'], $actor);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses/'.$expense->id)
            ->assertOk()
            ->assertJsonPath('car.registration_number', 'SHOW-01')
            ->assertJsonPath('created_by.id', $actor->id)
            ->assertJsonPath('title', 'Tires');
    }

    public function test_expense_history_survives_car_retirement(): void
    {
        $actor = $this->actor(['expenses.*', 'fleet.*']);
        $car = $this->car(['registration_number' => 'RET-01']);
        $expense = $this->expense($car, ['title' => 'Maintenance record'], $actor);

        // Retire the car (soft delete) — the expense ledger must not lose it.
        $this->actingAs($actor, 'sanctum')
            ->deleteJson('/api/v1/cars/'.$car->id)
            ->assertNoContent();

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Maintenance record')
            ->assertJsonPath('data.0.car.registration_number', 'RET-01');

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/expenses/'.$expense->id)
            ->assertOk()
            ->assertJsonPath('car.registration_number', 'RET-01');
    }
}
