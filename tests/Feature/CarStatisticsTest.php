<?php

namespace Tests\Feature;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\CarFinancing;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarStatisticsTest extends TestCase
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
            'purchase_price' => 100000,
        ], $attributes));
    }

    private function carExpense(Car $car, array $attributes = []): CarExpense
    {
        return CarExpense::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'created_by' => $this->actor([])->id,
        ], $attributes));
    }

    private function reservation(Car $car, array $overrides = []): Reservation
    {
        return Reservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => Client::factory()->create(['agency_id' => $this->agency->id])->id,
            'status' => ReservationStatus::Completed,
            'pickup_datetime' => today()->subDays(3)->setTime(9, 0),
            'expected_return_datetime' => today()->setTime(9, 0),
        ], $overrides));
    }

    private function financing(Car $car, array $overrides = []): CarFinancing
    {
        return CarFinancing::factory()->create(array_merge([
            'car_id' => $car->id,
            'purchase_date' => today()->subDays(30)->toDateString(),
            'purchase_price' => 100000,
            'down_payment' => 20000,
            'financed_amount' => 80000,
            'installment_amount' => 10000,
            'installments_count' => 8,
            'first_due_date' => today()->subMonths(2)->startOfMonth()->toDateString(),
        ], $overrides));
    }

    public function test_statistics_requires_financing_view_permission(): void
    {
        $outsider = $this->actor(['fleet.view']);
        $car = $this->car();

        $this->actingAs($outsider, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics")
            ->assertStatus(403)
            ->assertJsonPath('permission', 'financing.view');
    }

    public function test_statistics_matches_profitability_formulas(): void
    {
        $actor = $this->actor(['financing.view']);
        $car = $this->car();

        $financing = $this->financing($car);

        $reservation = $this->reservation($car);
        // In: one paid 50000 + one pending 9999 (excluded).
        Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'amount' => 50000,
            'status' => PaymentRecordStatus::Paid,
            'payment_date' => today(),
        ]);
        Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'amount' => 9999,
            'status' => PaymentRecordStatus::Pending,
            'payment_date' => today(),
        ]);

        // Out: one paid 5000 (counted) + one pending 1234 (excluded from KPI).
        $this->carExpense($car, [
            'type' => ExpenseType::Maintenance,
            'amount' => 5000,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->toDateString(),
        ]);
        $this->carExpense($car, [
            'type' => ExpenseType::Maintenance,
            'amount' => 1234,
            'status' => ExpenseStatus::Pending,
        ]);

        // Settle the first three installments.
        $financing->installments()->orderBy('installment_number')->limit(3)->get()
            ->each(fn ($installment) => $installment->markPaid(today()));

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics?months=3")
            ->assertOk()
            ->json();

        $kpis = $data['kpis'];
        $this->assertEqualsWithDelta(50000, $kpis['total_revenue'], 0.01);
        $this->assertEqualsWithDelta(5000, $kpis['total_expenses'], 0.01);
        $this->assertEqualsWithDelta(30000, $kpis['installments_paid'], 0.01);
        $this->assertEqualsWithDelta(45000, $kpis['operating_profit'], 0.01);
        $this->assertEqualsWithDelta(20000, $kpis['down_payment'], 0.01);
        // 50000 − 5000 − 20000 − 30000 = −5000.
        $this->assertEqualsWithDelta(-5000, $kpis['net_cash_position'], 0.01);
        $this->assertSame(30, $kpis['days_in_service']);
        $this->assertEqualsWithDelta(1500, $kpis['profit_per_day'], 0.01);
        $this->assertEqualsWithDelta(50, $kpis['payback_percent'], 0.01);
        $this->assertTrue($kpis['is_profitable']);

        // Utilization: 3 nights booked over a 30-day service window.
        $this->assertEqualsWithDelta(0.1, $kpis['utilization_rate'], 0.0001);
        $this->assertSame(3, $data['utilization']['rented_days']);
        $this->assertSame(30, $data['utilization']['days_in_service']);

        $progress = $data['financing_progress'];
        $this->assertTrue($progress['has_financing']);
        $this->assertSame(8, $progress['installments_count']);
        $this->assertSame(3, $progress['installments_paid_count']);
        $this->assertEqualsWithDelta(30000, $progress['installments_paid_amount'], 0.01);
        $this->assertEqualsWithDelta(50000, $progress['installments_remaining_amount'], 0.01);
        $this->assertEqualsWithDelta(37.5, $progress['progress_percent'], 0.01);
        $this->assertSame(4, $data['financing_progress']['next_installment']['installment_number']);

        // Current month: revenue 50000, expenses 5000, installments 30000.
        $series = $data['monthly_series'];
        $this->assertCount(3, $series);
        $last = end($series);
        $this->assertEqualsWithDelta(50000, $last['revenue'], 0.01);
        $this->assertEqualsWithDelta(5000, $last['expenses'], 0.01);
        $this->assertEqualsWithDelta(30000, $last['installments'], 0.01);
        $this->assertEqualsWithDelta(15000, $last['net'], 0.01);

        $maintenance = collect($data['expenses_by_type'])->firstWhere('type', 'maintenance');
        $this->assertEqualsWithDelta(6234, $maintenance['amount'], 0.01);
        $this->assertEqualsWithDelta(5000, $maintenance['paid'], 0.01);
    }

    public function test_statistics_without_financing_or_reservations_is_empty_not_error(): void
    {
        $actor = $this->actor(['financing.view']);
        $car = $this->car();

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics")
            ->assertOk()
            ->json();

        $this->assertFalse($data['financing_progress']['has_financing']);
        $this->assertNull($data['financing_progress']['next_installment']);
        $this->assertSame(0, $data['financing_progress']['installments_count']);
        $this->assertSame([], $data['expenses_by_type']);
        $this->assertSame([], $data['installments']);
        $this->assertCount(12, $data['monthly_series']);
        $this->assertEqualsWithDelta(0, $data['kpis']['total_revenue'], 0.01);
        $this->assertEqualsWithDelta(0, $data['kpis']['profit_per_day'], 0.01);
        $this->assertGreaterThanOrEqual(1, $data['kpis']['days_in_service']);
    }

    public function test_statistics_is_scoped_to_the_car(): void
    {
        $actor = $this->actor(['financing.view']);
        $car = $this->car();
        $otherCar = $this->car();

        $otherReservation = $this->reservation($otherCar, ['status' => ReservationStatus::Completed]);
        Payment::factory()->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $otherReservation->id,
            'amount' => 7777,
            'status' => PaymentRecordStatus::Paid,
            'payment_date' => today(),
        ]);
        $this->carExpense($otherCar, [
            'amount' => 4444,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->toDateString(),
        ]);
        $this->financing($otherCar);

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics")
            ->assertOk()
            ->json();

        $this->assertEqualsWithDelta(0, $data['kpis']['total_revenue'], 0.01);
        $this->assertEqualsWithDelta(0, $data['kpis']['total_expenses'], 0.01);
        $this->assertFalse($data['financing_progress']['has_financing']);
    }

    public function test_statistics_validates_months_range(): void
    {
        $actor = $this->actor(['financing.view']);
        $car = $this->car();

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics?months=0")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);

        $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/cars/{$car->id}/statistics?months=25")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }
}
