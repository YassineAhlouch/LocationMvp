<?php

namespace Tests\Feature;

use App\Enums\InstallmentStatus;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarFinancing;
use App\Models\CarInstallment;
use App\Models\CarModel;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarFinancingTest extends TestCase
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

    private function car(): Car
    {
        $brand = Brand::factory()->create();
        $model = CarModel::factory()->create(['brand_id' => $brand->id]);

        return Car::factory()->create([
            'agency_id' => $this->agency->id,
            'brand_id' => $brand->id,
            'model_id' => $model->id,
            'purchase_price' => 100000,
        ]);
    }

    private function financing(Car $car, array $overrides = []): CarFinancing
    {
        return CarFinancing::factory()->create(array_merge([
            'car_id' => $car->id,
            'purchase_date' => today()->subMonths(2)->toDateString(),
            'purchase_price' => 100000,
            'down_payment' => 20000,
            'financed_amount' => 80000,
            'installment_amount' => 10000,
            'installments_count' => 8,
            'first_due_date' => today()->addMonth()->startOfMonth()->toDateString(),
        ], $overrides));
    }

    public function test_store_creates_financing_and_generates_the_full_schedule(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/cars/{$car->id}/financing", [
                'purchase_date' => today()->subMonths(3)->toDateString(),
                'purchase_price' => 100000,
                'down_payment' => 20000,
                'installment_amount' => 10000,
                'installments_count' => 8,
                'first_due_date' => today()->addMonth()->startOfMonth()->toDateString(),
                'lender' => 'BMCI',
            ])
            ->assertCreated()
            ->assertJsonPath('financed_amount', 80000)
            ->assertJsonPath('installments_count', 8)
            ->assertJsonPath('lender', 'BMCI');

        $installments = CarInstallment::query()
            ->where('car_id', $car->id)
            ->orderBy('installment_number')
            ->get();

        $this->assertCount(8, $installments);
        $this->assertSame(1, $installments->first()->installment_number);
        $this->assertSame(8, $installments->last()->installment_number);
        $this->assertEqualsWithDelta(80000, $installments->sum(fn ($i) => (float) $i->amount), 0.01);
        $this->assertSame(
            today()->addMonth()->startOfMonth()->toDateString(),
            $installments->first()->due_date->toDateString(),
        );
        $this->assertSame(
            today()->addMonth()->startOfMonth()->addMonths(7)->toDateString(),
            $installments->last()->due_date->toDateString(),
        );
    }

    public function test_store_is_blocked_when_a_financing_already_exists(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();

        CarFinancing::factory()->create(['car_id' => $car->id, 'installments_count' => 2]);

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/cars/{$car->id}/financing", [
                'purchase_date' => today()->toDateString(),
                'purchase_price' => 50000,
                'down_payment' => 0,
                'installment_amount' => 5000,
                'installments_count' => 10,
                'first_due_date' => today()->addMonth()->toDateString(),
            ])
            ->assertStatus(422);
    }

    public function test_store_requires_the_manage_permission(): void
    {
        $viewer = $this->actor(['financing.view']);
        $car = $this->car();

        $this->actingAs($viewer, 'sanctum')
            ->postJson("/api/v1/cars/{$car->id}/financing", [
                'purchase_date' => today()->toDateString(),
                'purchase_price' => 50000,
                'down_payment' => 0,
                'installment_amount' => 5000,
                'installments_count' => 10,
                'first_due_date' => today()->addMonth()->toDateString(),
            ])
            ->assertStatus(403)
            ->assertJsonPath('permission', 'financing.manage');
    }

    public function test_update_regenerates_the_schedule_when_nothing_is_paid(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();
        $financing = CarFinancing::factory()->create([
            'car_id' => $car->id,
            'installments_count' => 8,
            'installment_amount' => 10000,
            'financed_amount' => 80000,
        ]);

        $this->assertDatabaseCount('car_installments', 8);

        $this->actingAs($actor, 'sanctum')
            ->patchJson("/api/v1/cars/{$car->id}/financing", [
                'installments_count' => 4,
                'installment_amount' => 20000,
                'financed_amount' => 80000,
            ])
            ->assertOk()
            ->assertJsonPath('installments_count', 4);

        $this->assertDatabaseCount('car_installments', 4);
        $this->assertEqualsWithDelta(
            80000,
            CarInstallment::query()->where('car_id', $car->id)->sum('amount'),
            0.01,
        );
    }

    public function test_marking_an_installment_paid_records_date_and_logs_activity(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();
        $financing = CarFinancing::factory()->create(['car_id' => $car->id, 'installments_count' => 3]);
        $installment = $financing->installments()->orderBy('installment_number')->first();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/cars/{$car->id}/installments/{$installment->id}/pay", [
                'paid_date' => today()->toDateString(),
                'reference' => 'CHQ-001',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'paid')
            ->assertJsonPath('reference', 'CHQ-001');

        $this->assertSame(InstallmentStatus::Paid, $installment->fresh()->status);
        $this->assertNotNull($installment->fresh()->paid_date);

        $this->assertDatabaseHas('activity_logs', [
            'module' => 'financing',
            'action' => 'installment_paid',
            'entity_type' => CarInstallment::class,
            'entity_id' => $installment->id,
            'user_id' => $actor->id,
        ]);
    }

    public function test_paying_an_installment_from_another_car_returns_404(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();
        $otherCar = $this->car();
        $financing = CarFinancing::factory()->create(['car_id' => $otherCar->id, 'installments_count' => 2]);
        $installment = $financing->installments()->first();

        $this->actingAs($actor, 'sanctum')
            ->postJson("/api/v1/cars/{$car->id}/installments/{$installment->id}/pay", [])
            ->assertNotFound();
    }

    public function test_destroy_removes_financing_and_its_installments(): void
    {
        $actor = $this->actor(['financing.manage']);
        $car = $this->car();
        CarFinancing::factory()->create(['car_id' => $car->id, 'installments_count' => 5]);

        $this->assertDatabaseCount('car_installments', 5);

        $this->actingAs($actor, 'sanctum')
            ->deleteJson("/api/v1/cars/{$car->id}/financing")
            ->assertNoContent();

        $this->assertDatabaseCount('car_financings', 0);
        $this->assertDatabaseCount('car_installments', 0);
    }

    public function test_overdue_command_marks_only_unpaid_past_due_installments(): void
    {
        $car = $this->car();
        $financing = CarFinancing::factory()->create([
            'car_id' => $car->id,
            'installments_count' => 3,
            'installment_amount' => 1000,
            'financed_amount' => 3000,
            'first_due_date' => today()->subMonths(3)->startOfMonth()->toDateString(),
        ]);

        $rows = $financing->installments()->orderBy('installment_number')->get();

        $overdue = $rows[0];
        $paid = $rows[1];
        $future = $rows[2];

        $overdue->forceFill(['due_date' => today()->subDay()])->save();
        $paid->forceFill(['due_date' => today()->subDay(), 'status' => InstallmentStatus::Paid, 'paid_date' => today()])->save();
        $future->forceFill(['due_date' => today()->addMonth()])->save();

        $this->artisan('installments:mark-overdue')->assertSuccessful();

        $this->assertSame(InstallmentStatus::Overdue, $overdue->fresh()->status);
        $this->assertSame(InstallmentStatus::Paid, $paid->fresh()->status);
        $this->assertSame(InstallmentStatus::Pending, $future->fresh()->status);
    }
}
