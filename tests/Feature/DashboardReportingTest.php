<?php

namespace Tests\Feature;

use App\Enums\ExpenseStatus;
use App\Enums\ExpenseType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use App\Enums\ReservationStatus;
use App\Models\Agency;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarExpense;
use App\Models\CarModel;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardReportingTest extends TestCase
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

    private function client(): Client
    {
        return Client::factory()->create(['agency_id' => $this->agency->id]);
    }

    private function reservation(Car $car, array $overrides = []): Reservation
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return Reservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $this->client()->id,
            'pickup_datetime' => $pickup,
            'expected_return_datetime' => $pickup->copy()->addDays(3),
        ], $overrides));
    }

    private function payment(Reservation $reservation, array $overrides = []): Payment
    {
        return Payment::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'payment_date' => now(),
            'method' => PaymentMethod::Cash,
            'status' => PaymentRecordStatus::Paid,
        ], $overrides));
    }

    private function expense(Car $car, array $overrides = []): CarExpense
    {
        return CarExpense::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'type' => ExpenseType::Maintenance,
            'status' => ExpenseStatus::Pending,
            'created_by' => $this->actor([])->id,
        ], $overrides));
    }

    public function test_summary_requires_dashboard_view_permission(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/dashboard/summary')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'dashboard.view');
    }

    public function test_summary_shapes_and_aggregates_money_for_the_period(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();

        // Money in: two paid records, one pending, one refunded, one outside
        // the window; plus a payment from another agency that must not leak.
        $reservation = $this->reservation($car);
        $this->payment($reservation, ['amount' => 1000]);
        $this->payment($reservation, ['amount' => 500]);
        $this->payment($reservation, ['amount' => 200, 'status' => PaymentRecordStatus::Pending]);
        $this->payment($reservation, ['amount' => 300, 'status' => PaymentRecordStatus::Refunded]);
        $this->payment($reservation, [
            'amount' => 9999,
            'payment_date' => now()->subMonth()->startOfMonth(),
        ]);

        $foreignAgency = Agency::factory()->create();
        $foreignCar = Car::factory()->create(['agency_id' => $foreignAgency]);
        $foreignReservation = Reservation::factory()->create([
            'agency_id' => $foreignAgency,
            'car_id' => $foreignCar->id,
            'primary_client_id' => Client::factory()->create(['agency_id' => $foreignAgency])->id,
        ]);
        Payment::factory()->create([
            'agency_id' => $foreignAgency,
            'reservation_id' => $foreignReservation->id,
            'amount' => 5000,
            'status' => PaymentRecordStatus::Paid,
        ]);

        // Money out: paid, pending, overdue, and one paid outside the window.
        $this->expense($car, [
            'amount' => 400,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->toDateString(),
        ]);
        $this->expense($car, ['amount' => 250, 'status' => ExpenseStatus::Pending]);
        $this->expense($car, [
            'amount' => 100,
            'status' => ExpenseStatus::Pending,
            'due_date' => today()->subDay()->toDateString(),
        ]);
        $this->expense($car, [
            'amount' => 9999,
            'status' => ExpenseStatus::Paid,
            'paid_date' => now()->subMonth()->startOfMonth()->toDateString(),
        ]);

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary?from='.today()->startOfMonth()->toDateString().'&to='.today()->toDateString())
            ->assertOk()
            ->json();

        $this->assertSame(today()->startOfMonth()->toDateString(), $data['period']['from']);
        $this->assertSame(today()->toDateString(), $data['period']['to']);

        $this->assertEqualsWithDelta(1500, $data['revenue']['paid'], 0.01);
        $this->assertEqualsWithDelta(200, $data['revenue']['pending'], 0.01);
        $this->assertEqualsWithDelta(300, $data['revenue']['refunded'], 0.01);
        $this->assertEqualsWithDelta(1200, $data['revenue']['net'], 0.01);

        $this->assertEqualsWithDelta(400, $data['expenses']['paid'], 0.01);
        $this->assertEqualsWithDelta(350, $data['expenses']['pending'], 0.01);
        $this->assertEqualsWithDelta(750, $data['expenses']['total'], 0.01);
        $this->assertSame(1, $data['expenses']['overdue_count']);

        $this->assertEqualsWithDelta(450, $data['net'], 0.01);
    }

    public function test_summary_counts_reservations_and_fleet_position(): void
    {
        $actor = $this->actor(['dashboard.view']);

        $carA = $this->car();
        $carB = $this->car();
        $maintenanceCar = $this->car(['status' => 'maintenance']);

        $this->reservation($carA, [
            'status' => ReservationStatus::Confirmed,
            'pickup_datetime' => today()->setTime(9, 0),
        ]);
        $this->reservation($carB, [
            'status' => ReservationStatus::Active,
            'pickup_datetime' => today()->subDay()->setTime(9, 0),
        ]);
        $this->reservation($carA, [
            'status' => ReservationStatus::Cancelled,
            'pickup_datetime' => today()->subDays(2)->setTime(9, 0),
        ]);
        // Picked up last month: outside the period, must not count in the
        // breakdown (but an active rental is tenant-wide, hence below).
        $this->reservation($carB, [
            'status' => ReservationStatus::Completed,
            'pickup_datetime' => now()->subMonth()->setTime(9, 0),
        ]);

        // Foreign agency activity must not leak into either counter.
        $foreignAgency = Agency::factory()->create();
        Reservation::factory()->create([
            'agency_id' => $foreignAgency,
            'car_id' => Car::factory()->create(['agency_id' => $foreignAgency])->id,
            'primary_client_id' => Client::factory()->create(['agency_id' => $foreignAgency])->id,
            'status' => ReservationStatus::Active,
        ]);

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary?from='.today()->startOfMonth()->toDateString().'&to='.today()->toDateString())
            ->assertOk()
            ->json();

        $this->assertSame([
            'pending' => 0,
            'confirmed' => 1,
            'reserved' => 0,
            'active' => 1,
            'completed' => 0,
            'cancelled' => 1,
            'no_show' => 0,
        ], $data['reservations']['by_status']);
        $this->assertSame(3, $data['reservations']['total']);
        $this->assertSame(1, $data['reservations']['currently_active']);

        $this->assertSame([
            'available' => 2,
            'reserved' => 0,
            'rented' => 0,
            'maintenance' => 1,
            'inactive' => 0,
        ], $data['fleet']['by_status']);
        $this->assertSame(3, $data['fleet']['total_cars']);
        $this->assertSame(1, $data['fleet']['currently_rented']);
    }

    public function test_summary_occupancy_matches_manual_calculation(): void
    {
        $actor = $this->actor(['dashboard.view']);

        $start = today()->subDays(5);
        $from = $start->toDateString();
        $to = $start->copy()->addDays(2)->toDateString();

        $carA = $this->car();
        $carB = $this->car();

        // Car A is hired for exactly the three days of the period; car B sits
        // idle. Pool = 2 cars × 3 days = 6 car-days, 3 booked → 0.5.
        $this->reservation($carA, [
            'status' => ReservationStatus::Confirmed,
            'pickup_datetime' => $start->copy()->setTime(9, 0),
            'expected_return_datetime' => $start->copy()->addDays(3)->setTime(9, 0),
        ]);

        // A cancelled hire must not occupy anything once excluded.
        $this->reservation($carB, [
            'status' => ReservationStatus::Cancelled,
            'pickup_datetime' => $start->copy()->setTime(9, 0),
            'expected_return_datetime' => $start->copy()->addDays(3)->setTime(9, 0),
        ]);

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary?from='.$from.'&to='.$to)
            ->assertOk()
            ->json();

        $this->assertSame(3, $data['occupancy']['booked_days']);
        $this->assertSame(6, $data['occupancy']['available_days']);
        $this->assertEqualsWithDelta(0.5, $data['occupancy']['rate'], 0.0001);
    }

    public function test_timeline_buckets_by_month_and_zero_fills(): void
    {
        $actor = $this->actor(['dashboard.view', 'reports.view']);
        $car = $this->car();
        $reservation = $this->reservation($car);

        $currentMonth = today()->format('Y-m');
        $lastMonth = today()->startOfMonth()->subMonth()->format('Y-m');
        $twoMonthsAgo = today()->startOfMonth()->subMonths(2)->format('Y-m');

        $this->payment($reservation, [
            'amount' => 400,
            'payment_date' => today()->startOfMonth()->subMonth()->addDays(5),
        ]);
        $this->payment($reservation, [
            'amount' => 1300,
            'payment_date' => today()->startOfMonth(),
        ]);
        $this->expense($car, [
            'amount' => 175,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->startOfMonth()->subMonths(2)->addDays(5)->toDateString(),
        ]);

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reports/timeline?months=3')
            ->assertOk()
            ->json();

        $this->assertSame([$twoMonthsAgo, $lastMonth, $currentMonth], $data['months']);

        $this->assertEqualsWithDelta(0, $data['revenue'][0], 0.01);
        $this->assertEqualsWithDelta(400, $data['revenue'][1], 0.01);
        $this->assertEqualsWithDelta(1300, $data['revenue'][2], 0.01);

        $this->assertEqualsWithDelta(175, $data['expenses'][0], 0.01);
        $this->assertEqualsWithDelta(0, $data['expenses'][1], 0.01);
        $this->assertEqualsWithDelta(0, $data['expenses'][2], 0.01);
    }

    public function test_timeline_validates_months_range(): void
    {
        $actor = $this->actor(['reports.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reports/timeline?months=0')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reports/timeline?months=13')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['months']);
    }

    public function test_reports_require_reports_view_while_dashboard_is_open_to_agents(): void
    {
        $agent = $this->actor(['dashboard.view']);

        $this->actingAs($agent, 'sanctum')
            ->getJson('/api/v1/dashboard/summary')
            ->assertOk();

        $this->actingAs($agent, 'sanctum')
            ->getJson('/api/v1/reports/timeline')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'reports.view');

        $this->actingAs($agent, 'sanctum')
            ->getJson('/api/v1/reports/cars')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'reports.view');
    }

    public function test_cars_report_ranks_by_margin_and_zero_fills(): void
    {
        $actor = $this->actor(['reports.view']);

        $from = today()->subDays(3)->toDateString();
        $to = today()->subDay()->toDateString();

        $carA = $this->car(['registration_number' => 'PROFIT-1']);
        $carB = $this->car(['registration_number' => 'BREAKEVEN-2']);
        $carC = $this->car(['registration_number' => 'IDLE-3']);

        // Car A: 800 revenue − 200 expenses over 3 booked days → +600.
        $reservationA = $this->reservation($carA, [
            'status' => ReservationStatus::Confirmed,
            'pickup_datetime' => today()->subDays(3)->setTime(9, 0),
            'expected_return_datetime' => today()->setTime(9, 0),
        ]);
        $this->payment($reservationA, ['amount' => 800, 'payment_date' => today()->subDays(2)]);
        // Outside the period — must not inflate revenue.
        $this->payment($reservationA, ['amount' => 9999, 'payment_date' => today()->subDays(10)]);
        $this->expense($carA, [
            'amount' => 200,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->subDay()->toDateString(),
        ]);

        // Car B: 100 revenue, 2 booked days, no expenses → +100.
        $reservationB = $this->reservation($carB, [
            'status' => ReservationStatus::Confirmed,
            'pickup_datetime' => today()->subDays(2)->setTime(9, 0),
            'expected_return_datetime' => today()->setTime(9, 0),
        ]);
        $this->payment($reservationB, ['amount' => 100, 'payment_date' => today()->subDay()]);

        // Car C: untouched → zero-filled row.

        $data = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/reports/cars?from='.$from.'&to='.$to)
            ->assertOk()
            ->assertJsonCount(3)
            ->json();

        $this->assertSame('PROFIT-1', $data[0]['registration_number']);
        $this->assertEqualsWithDelta(800, $data[0]['revenue'], 0.01);
        $this->assertEqualsWithDelta(200, $data[0]['expenses'], 0.01);
        $this->assertEqualsWithDelta(600, $data[0]['margin'], 0.01);
        $this->assertSame(3, $data[0]['booked_days']);

        $this->assertSame('BREAKEVEN-2', $data[1]['registration_number']);
        $this->assertEqualsWithDelta(100, $data[1]['revenue'], 0.01);
        $this->assertEqualsWithDelta(100, $data[1]['margin'], 0.01);
        $this->assertSame(2, $data[1]['booked_days']);

        $this->assertSame('IDLE-3', $data[2]['registration_number']);
        $this->assertEqualsWithDelta(0, $data[2]['revenue'], 0.01);
        $this->assertEqualsWithDelta(0, $data[2]['expenses'], 0.01);
        $this->assertEqualsWithDelta(0, $data[2]['margin'], 0.01);
        $this->assertSame(0, $data[2]['booked_days']);
        $this->assertNotNull($data[2]['brand']);
    }
}
