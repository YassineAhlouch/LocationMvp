<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
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

class DashboardKpiDetailTest extends TestCase
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

    private function client(array $attributes = []): Client
    {
        return Client::factory()->create(
            array_merge(['agency_id' => $this->agency->id], $attributes),
        );
    }

    private function booking(Car $car, Client $client, array $overrides = []): Reservation
    {
        $pickup = now()->addDay()->setTime(9, 0);

        return Reservation::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'primary_client_id' => $client->id,
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

    /** @return array<string, mixed> */
    private function kpi(string $metric, User $actor, string $query = ''): array
    {
        return $this->actingAs($actor, 'sanctum')
            ->getJson("/api/v1/dashboard/kpi/{$metric}{$query}")
            ->assertOk()
            ->json();
    }

    private function monthQuery(): string
    {
        return '?from='.today()->startOfMonth()->toDateString().'&to='.today()->toDateString();
    }

    public function test_kpi_requires_dashboard_view_permission(): void
    {
        $outsider = $this->actor(['clients.view']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson('/api/v1/dashboard/kpi/outstanding')
            ->assertStatus(403)
            ->assertJsonPath('permission', 'dashboard.view');
    }

    public function test_kpi_rejects_an_unknown_metric(): void
    {
        $actor = $this->actor(['dashboard.view']);

        $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/kpi/not-a-card')
            ->assertStatus(422)
            ->assertJsonValidationErrors('metric');
    }

    public function test_net_revenue_detail_ties_back_to_the_card(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();
        $reservation = $this->booking($car, $this->client());

        $this->payment($reservation, ['amount' => 1000, 'method' => PaymentMethod::Cash, 'payment_date' => today()->subDays(3)]);
        $this->payment($reservation, ['amount' => 500, 'method' => PaymentMethod::Card, 'payment_date' => today()->subDays(2)]);
        $this->payment($reservation, ['amount' => 200, 'status' => PaymentRecordStatus::Pending, 'payment_date' => today()->subDay()]);
        $this->payment($reservation, ['amount' => 300, 'status' => PaymentRecordStatus::Refunded]);
        $this->payment($reservation, [
            'amount' => 9999,
            'payment_date' => now()->subMonth()->startOfMonth(),
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('net-revenue', $actor, $this->monthQuery());

        $this->assertSame('net-revenue', $data['metric']);
        $this->assertSame(today()->startOfMonth()->toDateString(), $data['period']['from']);

        // The headline is the card, to the cent.
        $this->assertEqualsWithDelta($summary['revenue']['net'], $data['headline']['value'], 0.01);
        $this->assertEqualsWithDelta($summary['revenue']['paid'], $data['headline']['paid'], 0.01);
        $this->assertEqualsWithDelta($summary['revenue']['pending'], $data['headline']['pending'], 0.01);
        $this->assertEqualsWithDelta($summary['revenue']['refunded'], $data['headline']['refunded'], 0.01);

        // The method split explains the paid money, nothing more — largest
        // slice first.
        $this->assertSame(['cash', 'card'], array_column($data['breakdown'], 'key'));
        $this->assertEqualsWithDelta(
            $summary['revenue']['paid'],
            array_sum(array_column($data['breakdown'], 'value')),
            0.01,
        );

        // One point per day of the window, zero-filled.
        $windowDays = (int) today()->startOfMonth()->diffInDays(today()) + 1;
        $this->assertCount($windowDays, $data['trend']['labels']);
        $this->assertCount($windowDays, $data['trend']['paid']);

        // The rows are the in-window money movements, newest first; the
        // out-of-window one stays out.
        $this->assertSame(4, $data['rows_total']);
        $this->assertSame([300, 200, 500, 1000], array_column($data['rows'], 'amount'));
        $this->assertSame('refunded', $data['rows'][0]['status']);
        $this->assertSame('cash', $data['rows'][3]['method']);
        $this->assertSame('paid', $data['rows'][3]['status']);
        $this->assertNotNull($data['rows'][0]['reservation_number']);
        $this->assertNotNull($data['rows'][0]['client']);
    }

    public function test_expenses_detail_splits_paid_from_pending_booked(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();

        $this->expense($car, [
            'amount' => 400,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->toDateString(),
            'type' => ExpenseType::Insurance,
        ]);
        $this->expense($car, ['amount' => 250, 'type' => ExpenseType::Repair]);
        $this->expense($car, [
            'amount' => 9999,
            'status' => ExpenseStatus::Paid,
            'paid_date' => now()->subMonth()->startOfMonth()->toDateString(),
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('expenses', $actor, $this->monthQuery());

        $this->assertEqualsWithDelta($summary['expenses']['total'], $data['headline']['value'], 0.01);
        $this->assertEqualsWithDelta($summary['expenses']['paid'], $data['headline']['paid'], 0.01);
        $this->assertEqualsWithDelta($summary['expenses']['pending'], $data['headline']['pending'], 0.01);
        $this->assertSame($summary['expenses']['overdue_count'], $data['headline']['overdue_count']);

        // Type segments total the headline, and the paid bill's type differs
        // from the pending one's.
        $this->assertEqualsWithDelta(
            $summary['expenses']['total'],
            array_sum(array_column($data['breakdown'], 'value')),
            0.01,
        );
        $this->assertSame(['insurance', 'repair'], array_column($data['breakdown'], 'key'));

        // The paid bill dates the row by paid_date, the pending one by when it
        // was booked — both land inside the window.
        $this->assertSame(2, $data['rows_total']);
        $this->assertSame(400, $data['rows'][0]['amount']);
        $this->assertSame('paid', $data['rows'][0]['status']);
        $this->assertSame(today()->toDateString(), $data['rows'][0]['period_date']);
        $this->assertSame('pending', $data['rows'][1]['status']);
    }

    public function test_reservations_detail_counts_pickups_by_status(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();
        $client = $this->client();

        // The hire must start inside the window for the card to count it.
        $this->booking($car, $client, [
            'status' => ReservationStatus::Active,
            'pickup_datetime' => today()->setTime(14, 0),
            'expected_return_datetime' => today()->setTime(14, 0)->addDays(3),
        ]);
        $this->booking($car, $client, [
            'status' => ReservationStatus::Confirmed,
            'pickup_datetime' => today()->setTime(15, 0),
            'expected_return_datetime' => today()->setTime(15, 0)->addDays(3),
        ]);
        // The card counts every booking picked up in the window, cancelled or
        // not — the drill-down shows the same set.
        $this->booking($car, $client, [
            'status' => ReservationStatus::Cancelled,
            'pickup_datetime' => today()->setTime(16, 0),
            'expected_return_datetime' => today()->setTime(16, 0)->addDays(3),
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('reservations', $actor, $this->monthQuery());

        $this->assertSame($summary['reservations']['total'], $data['headline']['value']);
        $this->assertSame($summary['reservations']['currently_active'], $data['headline']['currently_active']);

        $byStatus = array_column($data['breakdown'], 'value', 'key');
        $this->assertSame(1, $byStatus['active']);
        $this->assertSame(1, $byStatus['confirmed']);
        $this->assertSame(1, $byStatus['cancelled']);

        // Every counted booking is a row, and the daily series adds up to the
        // same total.
        $this->assertSame(3, $data['rows_total']);
        $this->assertSame(
            $data['headline']['value'],
            array_sum($data['trend']['count']),
        );
        $this->assertNotNull($data['rows'][0]['car']);
        $this->assertNotNull($data['rows'][0]['client']);
    }

    public function test_occupancy_detail_reports_daily_utilization_and_per_car_rows(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $busy = $this->car();
        $idle = $this->car();

        // A hire ending today, three nights, sits entirely inside the window.
        $this->booking($busy, $this->client(), [
            'pickup_datetime' => today()->subDays(3)->setTime(9, 0),
            'expected_return_datetime' => today()->setTime(9, 0),
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('occupancy', $actor, $this->monthQuery());

        $this->assertEqualsWithDelta($summary['occupancy']['rate'], $data['headline']['value'], 0.0001);
        $this->assertSame($summary['occupancy']['booked_days'], $data['headline']['booked_days']);
        $this->assertSame($summary['occupancy']['available_days'], $data['headline']['available_days']);
        $this->assertSame(2, $data['headline']['total_cars']);

        // The pie is the rate's own arithmetic: booked + free = capacity.
        $segments = array_column($data['breakdown'], 'value', 'key');
        $this->assertSame(3, $segments['booked']);
        $this->assertSame(
            $data['headline']['available_days'],
            $segments['booked'] + $segments['free'],
        );

        // Both cars are listed, busiest first, with a per-car utilization.
        $this->assertSame(2, $data['rows_total']);
        $this->assertSame($busy->registration_number, $data['rows'][0]['registration_number']);
        $this->assertSame(3, $data['rows'][0]['booked_days']);
        $this->assertSame($idle->registration_number, $data['rows'][1]['registration_number']);
        $this->assertSame(0, $data['rows'][1]['booked_days']);
        $this->assertEqualsWithDelta(0.0, $data['rows'][1]['utilization'], 0.0001);

        // No day shows more cars hired than the fleet owns.
        $this->assertLessThanOrEqual(
            2,
            max($data['trend']['count']),
        );
    }

    public function test_outstanding_detail_lists_balances_and_ties_to_the_card(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();
        $client = $this->client();

        $partial = $this->booking($car, $client, ['total_amount' => 1000]);
        $this->payment($partial, ['amount' => 400]);

        $unpaid = $this->booking($car, $client, ['total_amount' => 700]);

        // Nothing is owed on a cancelled booking, however it was priced.
        $this->booking($car, $client, [
            'total_amount' => 5000,
            'status' => ReservationStatus::Cancelled,
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('outstanding', $actor, $this->monthQuery());

        $this->assertEqualsWithDelta($summary['outstanding']['amount'], $data['headline']['value'], 0.01);
        $this->assertSame($summary['outstanding']['reservations'], $data['headline']['reservations']);

        // Largest balance first, with what has been paid alongside.
        $this->assertSame(2, $data['rows_total']);
        $this->assertSame($unpaid->id, $data['rows'][0]['id']);
        $this->assertSame(700, $data['rows'][0]['due_amount']);
        $this->assertSame(0, $data['rows'][0]['paid_amount']);
        $this->assertSame($partial->id, $data['rows'][1]['id']);
        $this->assertSame(400, $data['rows'][1]['paid_amount']);
        $this->assertSame(600, $data['rows'][1]['due_amount']);

        // The status split adds back up to the headline amount.
        $this->assertEqualsWithDelta(
            $data['headline']['value'],
            array_sum(array_column($data['breakdown'], 'value')),
            0.01,
        );
        $this->assertEqualsWithDelta(
            $data['headline']['reservations'],
            array_sum(array_column($data['breakdown'], 'count')),
            0.01,
        );
    }

    public function test_today_detail_lists_pickups_and_returns(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();
        $client = $this->client();

        $leaving = $this->booking($car, $client, [
            'pickup_datetime' => today()->setTime(10, 0),
            'expected_return_datetime' => today()->setTime(10, 0)->addDays(2),
        ]);
        $comingBack = $this->booking($car, $client, [
            'pickup_datetime' => today()->subDays(2)->setTime(10, 0),
            'expected_return_datetime' => today()->setTime(17, 0),
        ]);
        $this->booking($car, $client, [
            'pickup_datetime' => today()->addDays(3)->setTime(10, 0),
            'expected_return_datetime' => today()->addDays(5)->setTime(10, 0),
            'status' => ReservationStatus::Cancelled,
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('today', $actor, $this->monthQuery());

        $this->assertSame($summary['today']['pickups'], $data['headline']['pickups']);
        $this->assertSame($summary['today']['returns'], $data['headline']['returns']);
        $this->assertSame(2, $data['headline']['value']);

        $kinds = array_column($data['rows'], 'kind');
        sort($kinds);
        $this->assertSame(['pickup', 'return'], $kinds);

        $pickupRow = collect($data['rows'])->firstWhere('kind', 'pickup');
        $returnRow = collect($data['rows'])->firstWhere('kind', 'return');
        $this->assertSame($leaving->id, $pickupRow['id']);
        $this->assertSame($comingBack->id, $returnRow['id']);
    }

    public function test_fleet_attention_detail_lists_maintenance_and_overdue_cars(): void
    {
        $actor = $this->actor(['dashboard.view']);

        $overdue = $this->car([
            'current_mileage' => 52000,
            'next_service_mileage' => 50000,
        ]);
        $inMaintenance = $this->car([
            'status' => CarStatus::Maintenance,
            'current_mileage' => 10000,
            'next_service_mileage' => 60000,
        ]);
        $healthy = $this->car([
            'current_mileage' => 10000,
            'next_service_mileage' => 60000,
        ]);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('fleet-attention', $actor, $this->monthQuery());

        $this->assertSame($summary['attention']['total'], $data['headline']['value']);
        $this->assertSame(1, $data['headline']['maintenance']);
        $this->assertSame(1, $data['headline']['service_overdue']);

        // The healthy car never shows up; the parked one leads, and the
        // overdue one carries how far past its service it has drifted.
        $this->assertSame(2, $data['rows_total']);
        $this->assertSame($inMaintenance->registration_number, $data['rows'][0]['registration_number']);
        $this->assertTrue($data['rows'][0]['in_maintenance']);
        $this->assertFalse($data['rows'][0]['service_overdue']);

        $overdueRow = $data['rows'][1];
        $this->assertSame($overdue->registration_number, $overdueRow['registration_number']);
        $this->assertFalse($overdueRow['in_maintenance']);
        $this->assertTrue($overdueRow['service_overdue']);
        $this->assertSame(2000, $overdueRow['service_gap']);
        $this->assertNotContains(
            $healthy->registration_number,
            array_column($data['rows'], 'registration_number'),
        );
    }

    public function test_new_clients_detail_counts_signups_in_the_window(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $car = $this->car();

        $fresh = $this->client(['source' => 'whatsapp']);
        $old = $this->client(['created_at' => now()->subMonth()->startOfMonth()]);

        // A signup for the agency booked at least once shows its tally.
        $this->booking($car, $fresh);

        $summary = $this->actingAs($actor, 'sanctum')
            ->getJson('/api/v1/dashboard/summary'.$this->monthQuery())
            ->assertOk()
            ->json();

        $data = $this->kpi('new-clients', $actor, $this->monthQuery());

        $this->assertSame($summary['new_clients'], $data['headline']['value']);
        $this->assertSame(1, $data['headline']['value']);

        $this->assertSame('whatsapp', $data['breakdown'][0]['key']);
        $this->assertSame(1, $data['breakdown'][0]['value']);

        $this->assertSame(1, $data['rows_total']);
        $this->assertSame($fresh->id, $data['rows'][0]['id']);
        $this->assertSame(1, $data['rows'][0]['reservations_count']);
        $this->assertNotNull($data['rows'][0]['full_name']);

        // The out-of-window signup is absent from rows, breakdown and series.
        $this->assertNotContains($old->id, array_column($data['rows'], 'id'));
        $this->assertSame(1, array_sum($data['trend']['count']));
    }

    public function test_kpi_details_never_leak_another_agencys_records(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $ownCar = $this->car();

        // Everything else belongs to somebody else.
        $foreignAgency = Agency::factory()->create();
        $foreignCar = Car::factory()->create([
            'agency_id' => $foreignAgency,
            'status' => CarStatus::Maintenance,
            'current_mileage' => 90000,
            'next_service_mileage' => 10000,
        ]);
        $foreignClient = Client::factory()->create([
            'agency_id' => $foreignAgency,
            'created_at' => now(),
        ]);
        $foreignReservation = Reservation::factory()->create([
            'agency_id' => $foreignAgency,
            'car_id' => $foreignCar->id,
            'primary_client_id' => $foreignClient->id,
            'pickup_datetime' => today()->setTime(9, 0),
            'expected_return_datetime' => today()->setTime(9, 0)->addDays(3),
            'total_amount' => 7777,
        ]);
        Payment::factory()->create([
            'agency_id' => $foreignAgency,
            'reservation_id' => $foreignReservation->id,
            'amount' => 6666,
            'payment_date' => now(),
            'status' => PaymentRecordStatus::Paid,
        ]);
        CarExpense::factory()->create([
            'agency_id' => $foreignAgency,
            'car_id' => $foreignCar->id,
            'amount' => 5555,
            'status' => ExpenseStatus::Paid,
            'paid_date' => today()->toDateString(),
            'created_by' => $this->actor([])->id,
        ]);

        foreach ([
            'net-revenue',
            'expenses',
            'reservations',
            'occupancy',
            'outstanding',
            'today',
            'fleet-attention',
            'new-clients',
        ] as $metric) {
            $data = $this->kpi($metric, $actor, $this->monthQuery());

            // Occupancy lists the whole own fleet (one idle car here); every
            // other drill-down lists only records, of which there are none.
            $expected = $metric === 'occupancy' ? 1 : 0;

            $this->assertSame(
                $expected,
                $data['rows_total'],
                "The [{$metric}] drill-down counted another agency's records.",
            );
            $this->assertCount(
                $expected,
                $data['rows'],
                "The [{$metric}] drill-down leaked another agency's records.",
            );
            $this->assertSame(
                0,
                (int) $data['headline']['value'],
                "The [{$metric}] headline counted another agency's money or records.",
            );
        }
    }

    public function test_kpi_rows_are_capped_with_the_real_total_reported(): void
    {
        $actor = $this->actor(['dashboard.view']);
        $reservation = $this->booking($this->car(), $this->client());

        Payment::factory()->count(205)->create([
            'agency_id' => $this->agency->id,
            'reservation_id' => $reservation->id,
            'amount' => 1,
            'payment_date' => now(),
            'method' => PaymentMethod::Cash,
            'status' => PaymentRecordStatus::Paid,
        ]);

        $data = $this->kpi('net-revenue', $actor, $this->monthQuery());

        $this->assertCount(200, $data['rows']);
        $this->assertSame(205, $data['rows_total']);
        $this->assertEqualsWithDelta(205, $data['headline']['paid'], 0.01);
    }
}
