<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Enums\ExpenseType;
use App\Enums\InstallmentStatus;
use App\Enums\PaymentRecordStatus;
use App\Enums\PricingType;
use App\Enums\ReservationStatus;
use App\Models\ActivityLog;
use App\Models\Agency;
use App\Models\Car;
use App\Models\CarInstallment;
use App\Models\Client;
use App\Models\Extra;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Real-world one-month simulation for the Location (car-rental) system.
 *
 * Freezes the clock and drives the whole agency through a full month of
 * operations — 1 September 2026 → 1 October 2026 — over the real HTTP API:
 * fleet, clients, reservations (every lifecycle branch), the payment ledger
 * (paid / pending → confirmed / refunded), the expense ledger (paid/pending +
 * derived overdue), car financing with its generated installment schedule and
 * the overdue sweep, plus the analytics surfaces (dashboard, reports, per-car
 * statistics) and the audit trail.
 *
 * Each test rebuilds the same deterministic month in setUp (RefreshDatabase
 * isolates them) so a failure pinpoints one surface without masking the rest.
 */
class SystemMonthSimulationTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    private User $admin;

    private User $manager;

    private User $finance;

    private User $agent;

    /**
     * Scenario references + expected cash-basis totals.
     *
     * @var array<string, mixed>
     */
    private array $s = [];

    protected function setUp(): void
    {
        parent::setUp();

        // The month starts here: base fixtures get September timestamps.
        Carbon::setTestNow(Carbon::parse('2026-09-01 08:00:00'));

        $this->agency = Agency::factory()->create(['name' => 'Atlas Rentals Marrakech']);

        $this->admin = $this->user(['*'], 'Amina', 'Admin');
        $this->manager = $this->user([
            'dashboard.view', 'reservations.*', 'clients.*', 'fleet.*', 'extras.*',
            'pricing.*', 'payments.view', 'payments.create', 'payments.refund',
            'expenses.*', 'financing.*', 'reports.view', 'activity_logs.view',
        ], 'Mounir', 'Manager');
        $this->finance = $this->user([
            'dashboard.view', 'payments.view', 'expenses.view',
            'financing.view', 'financing.manage', 'reports.view', 'activity_logs.view',
        ], 'Fatima', 'Finance');
        $this->agent = $this->user([
            'dashboard.view', 'reservations.*', 'clients.*', 'fleet.view',
            'payments.view', 'payments.create', 'expenses.view', 'extras.view',
        ], 'Agent', 'Smith');

        $this->prepareFleet();
        $this->runSeptember();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    // ---------------------------------------------------------------------
    // Scenario construction
    // ---------------------------------------------------------------------

    private function user(array $permissions, string $first, string $last): User
    {
        $role = Role::factory()->create([
            'name' => 'role-'.strtolower($first),
            'permissions' => $permissions,
        ]);

        return User::factory()->create([
            'agency_id' => $this->agency->id,
            'role_id' => $role->id,
            'first_name' => $first,
            'last_name' => $last,
        ]);
    }

    private function at(string $datetime): void
    {
        Carbon::setTestNow(Carbon::parse($datetime));
    }

    private function actAsAdmin(): void
    {
        $this->actingAs($this->admin, 'sanctum');
    }

    public function test_full_september_simulation_runs_the_whole_system(): void
    {
        $s = $this->s;

        $this->assertNotEmpty($s);

        // Sanity: all four roles sit on the same agency.
        foreach ([$this->admin, $this->manager, $this->finance, $this->agent] as $user) {
            $this->assertSame($this->agency->id, $user->agency_id);
        }
    }

    public function test_reservation_lifecycle_and_fleet_state_across_september(): void
    {
        $this->assertSame(ReservationStatus::Completed, Reservation::findOrFail($this->s['r1'])->status);
        $this->assertSame(ReservationStatus::Completed, Reservation::findOrFail($this->s['r2'])->status);
        $this->assertSame(ReservationStatus::Cancelled, Reservation::findOrFail($this->s['r3'])->status);
        $this->assertSame(ReservationStatus::Completed, Reservation::findOrFail($this->s['r4'])->status);
        $this->assertSame(ReservationStatus::Completed, Reservation::findOrFail($this->s['r5'])->status);
        $this->assertSame(ReservationStatus::NoShow, Reservation::findOrFail($this->s['r6'])->status);
        $this->assertSame(ReservationStatus::Completed, Reservation::findOrFail($this->s['r7'])->status);
        $this->assertSame(ReservationStatus::Active, Reservation::findOrFail($this->s['r8'])->status);
        $this->assertSame(ReservationStatus::Confirmed, Reservation::findOrFail($this->s['r9'])->status);
        $this->assertSame(ReservationStatus::Cancelled, Reservation::findOrFail($this->s['r10'])->status);

        // Pricing snapshots: rate × days, extras, tax (20%), no surprises.
        $this->assertEqualsWithDelta(1440.0, (float) Reservation::find($this->s['r1'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(1440.0, (float) Reservation::find($this->s['r2'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(1680.0, (float) Reservation::find($this->s['r4'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(1680.0, (float) Reservation::find($this->s['r5'])->total_amount, 0.01);
        // 7 days @600 − 5% weekly + (GPS 100 + chauffeur 50×7 = 450) → 4440 + 888 tax.
        $this->assertEqualsWithDelta(5328.0, (float) Reservation::find($this->s['r7'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(3600.0, (float) Reservation::find($this->s['r8'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(1080.0, (float) Reservation::find($this->s['r9'])->total_amount, 0.01);
        $this->assertEqualsWithDelta(360.0, (float) Reservation::find($this->s['r10'])->total_amount, 0.01);

        // Payment status derives from the settled ledger, never from payload.
        $this->assertSame('paid', Reservation::find($this->s['r1'])->payment_status->value);
        $this->assertSame('paid', Reservation::find($this->s['r2'])->payment_status->value);
        $this->assertSame('paid', Reservation::find($this->s['r4'])->payment_status->value);
        $this->assertSame('paid', Reservation::find($this->s['r5'])->payment_status->value);
        $this->assertSame('paid', Reservation::find($this->s['r7'])->payment_status->value);
        $this->assertSame('partial', Reservation::find($this->s['r8'])->payment_status->value);
        $this->assertSame('unpaid', Reservation::find($this->s['r9'])->payment_status->value);
        // The 360 was refunded, so the cancelled booking is back to unpaid.
        $this->assertSame('unpaid', Reservation::find($this->s['r10'])->payment_status->value);

        // Fleet: CarA is held by the upcoming confirmed booking, CarB is free,
        // CarC is out on the active rental.
        $this->assertSame(CarStatus::Reserved, $this->s['carA']->fresh()->status);
        $this->assertSame(CarStatus::Available, $this->s['carB']->fresh()->status);
        $this->assertSame(CarStatus::Rented, $this->s['carC']->fresh()->status);

        // Mileage is written back by the completed rentals.
        $this->assertSame(50800, (int) $this->s['carA']->fresh()->current_mileage);
        $this->assertSame(30900, (int) $this->s['carB']->fresh()->current_mileage);
        $this->assertSame(15600, (int) $this->s['carC']->fresh()->current_mileage);

        // Every lifecycle row left an audit change on the reservation.
        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $this->s['r5'],
            'change_type' => 'status_change',
            'new_value' => 'completed',
        ]);
        $this->assertDatabaseHas('reservation_changes', [
            'reservation_id' => $this->s['r6'],
            'new_value' => 'no_show',
            'reason' => 'Client never collected the car',
        ]);
    }

    public function test_availability_blocks_overlaps_and_extension_moves_the_return(): void
    {
        // R9 occupies CarA Oct 5 → Oct 8. A probe inside that window conflicts.
        $this->at('2026-10-02 09:00:00');

        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/reservations/availability?'.http_build_query([
                'car_id' => $this->s['carA']->id,
                'pickup_datetime' => '2026-10-06 09:00:00',
                'expected_return_datetime' => '2026-10-07 09:00:00',
            ]))
            ->assertOk()
            ->assertJsonPath('available', false)
            ->assertJsonPath('conflicts.0.reservation_number', Reservation::find($this->s['r9'])->reservation_number);

        // Back-to-back after the booking is free.
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/reservations/availability?'.http_build_query([
                'car_id' => $this->s['carA']->id,
                'pickup_datetime' => '2026-10-08 09:00:00',
                'expected_return_datetime' => '2026-10-10 09:00:00',
            ]))
            ->assertOk()
            ->assertJsonPath('available', true);

        // Extending R9 pushes the return and reprices (3 → 5 days).
        $before = (float) Reservation::find($this->s['r9'])->total_amount;

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s['r9']}/extend", [
                'expected_return_datetime' => '2026-10-10 09:00:00',
                'reason' => 'Client extended the trip',
            ])
            ->assertOk()
            ->assertJsonPath('rental_days', 5);

        $after = Reservation::find($this->s['r9']);
        $this->assertSame('2026-10-10 09:00:00', $after->expected_return_datetime->toDateTimeString());
        $this->assertGreaterThan($before, (float) $after->total_amount);
        $this->assertEqualsWithDelta(1800.0, (float) $after->total_amount, 0.01);
    }

    public function test_payments_ledger_and_overview_reconcile_with_september(): void
    {
        $this->at('2026-10-02 09:00:00');

        $overview = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/payments/overview?from=2026-09-01&to=2026-10-01')
            ->assertOk();

        $this->assertEqualsWithDelta(12568.0, $overview->json('totals.paid'), 0.01);
        $this->assertEqualsWithDelta(500.0, $overview->json('totals.pending'), 0.01);
        $this->assertEqualsWithDelta(360.0, $overview->json('totals.refunded'), 0.01);
        $this->assertEqualsWithDelta(12208.0, $overview->json('totals.net'), 0.01);

        $this->assertSame(8, $overview->json('counts.paid'));
        $this->assertSame(1, $overview->json('counts.pending'));
        $this->assertSame(1, $overview->json('counts.refunded'));
        $this->assertSame(10, $overview->json('counts.total'));

        // The daily trend covers every day of the month, zero-filled.
        $this->assertCount(31, $overview->json('trend.labels'));
        $this->assertEqualsWithDelta(12568.0, array_sum($overview->json('trend.paid')), 0.01);

        // Agency-wide ledger exposes every row, newest first.
        $ledger = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/payments?per_page=50')
            ->assertOk();

        $this->assertCount(10, $ledger->json('data'));

        // A pending transfer is confirmed via the dedicated endpoint.
        $pending = Payment::where('status', PaymentRecordStatus::Pending)->sole();
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/payments/{$pending->id}/confirm")
            ->assertOk()
            ->assertJsonPath('status', 'paid');

        // The 500 was the balance on a 3600 booking, so 1500 is now settled
        // and the reservation sits at partial — not paid.
        $this->assertSame(
            'partial',
            Reservation::findOrFail($this->s['r8'])->payment_status->value,
        );
    }

    public function test_expense_ledger_overdue_derivation_and_settlement(): void
    {
        $this->at('2026-10-02 09:00:00');

        $list = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/expenses?per_page=50')
            ->assertOk();

        $this->assertCount(8, $list->json('data'));

        // Two pending bills are past due on 2 October.
        $overdue = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/expenses?status=overdue&per_page=50')
            ->assertOk();

        $this->assertCount(2, $overdue->json('data'));
        foreach ($overdue->json('data') as $row) {
            $this->assertTrue($row['is_overdue']);
            $this->assertSame('pending', $row['status']);
        }

        // Settling the overdue repair removes it from the overdue bucket.
        $repair = collect($overdue->json('data'))->firstWhere('type', ExpenseType::Repair->value);

        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/v1/expenses/{$repair['id']}", [
                'status' => 'paid',
                'paid_date' => '2026-10-02',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'paid')
            ->assertJsonPath('is_overdue', false);

        $after = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/expenses?status=overdue&per_page=50')
            ->assertOk();

        $this->assertCount(1, $after->json('data'));
    }

    public function test_car_financing_schedules_and_statistics(): void
    {
        $this->at('2026-10-02 09:00:00');

        // The schedules were materialised automatically on creation.
        $carBInstallments = CarInstallment::where('car_id', $this->s['carB']->id)->get();
        $carCInstallments = CarInstallment::where('car_id', $this->s['carC']->id)->get();

        $this->assertCount(12, $carBInstallments);
        $this->assertCount(24, $carCInstallments);
        $this->assertEqualsWithDelta(
            144000.0,
            (float) $carBInstallments->sum('amount'),
            0.01,
        );
        $this->assertEqualsWithDelta(
            192000.0,
            (float) $carCInstallments->sum('amount'),
            0.01,
        );

        $carB = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carB']->id}/statistics?months=12")
            ->assertOk();

        $this->assertEqualsWithDelta(3360.0, $carB->json('kpis.total_revenue'), 0.01);
        $this->assertEqualsWithDelta(1900.0, $carB->json('kpis.total_expenses'), 0.01);
        $this->assertEqualsWithDelta(96000.0, $carB->json('kpis.installments_paid'), 0.01);
        $this->assertEqualsWithDelta(1460.0, $carB->json('kpis.operating_profit'), 0.01);
        $this->assertEqualsWithDelta(-130540.0, $carB->json('kpis.net_cash_position'), 0.01);
        $this->assertSame(260, $carB->json('kpis.days_in_service'));
        $this->assertEqualsWithDelta(5.62, $carB->json('kpis.profit_per_day'), 0.01);
        $this->assertEqualsWithDelta(0.0308, $carB->json('kpis.utilization_rate'), 0.0001);
        $this->assertEqualsWithDelta(1.87, $carB->json('kpis.payback_percent'), 0.01);

        $this->assertTrue($carB->json('financing_progress.has_financing'));
        $this->assertSame(8, $carB->json('financing_progress.installments_paid_count'));
        $this->assertEqualsWithDelta(66.67, $carB->json('financing_progress.progress_percent'), 0.01);
        $this->assertEqualsWithDelta(48000.0, $carB->json('financing_progress.installments_remaining_amount'), 0.01);
        $this->assertSame('pending', $carB->json('financing_progress.next_installment.status'));

        $carC = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carC']->id}/statistics?months=12")
            ->assertOk();

        $this->assertEqualsWithDelta(6328.0, $carC->json('kpis.total_revenue'), 0.01);
        $this->assertEqualsWithDelta(2700.0, $carC->json('kpis.total_expenses'), 0.01);
        $this->assertEqualsWithDelta(8000.0, $carC->json('kpis.installments_paid'), 0.01);
        $this->assertEqualsWithDelta(3628.0, $carC->json('kpis.operating_profit'), 0.01);
        $this->assertEqualsWithDelta(-52372.0, $carC->json('kpis.net_cash_position'), 0.01);
        $this->assertSame(58, $carC->json('kpis.days_in_service'));
        $this->assertEqualsWithDelta(62.55, $carC->json('kpis.profit_per_day'), 0.01);
        $this->assertEqualsWithDelta(0.2069, $carC->json('kpis.utilization_rate'), 0.0001);
        $this->assertEqualsWithDelta(2.64, $carC->json('kpis.payback_percent'), 0.01);
        $this->assertSame(12, $carC->json('utilization.rented_days'));
        $this->assertSame(3, $carC->json('utilization.maintenance_days'));

        // The due-on-28-September installment is late and derived as overdue.
        $this->assertSame('overdue', $carC->json('financing_progress.next_installment.status'));
        $this->assertEqualsWithDelta(4.17, $carC->json('financing_progress.progress_percent'), 0.01);

        // September bucket of the monthly series reconciles.
        $september = collect($carC->json('monthly_series'))->firstWhere('month', '2026-09');
        $this->assertNotNull($september);
        $this->assertEqualsWithDelta(6328.0, (float) $september['revenue'], 0.01);
        $this->assertEqualsWithDelta(2700.0, (float) $september['expenses'], 0.01);
        $this->assertEqualsWithDelta(3628.0, (float) $september['net'], 0.01);

        $this->assertCount(2, $carC->json('expenses_by_type'));
        $this->assertSame('insurance', $carC->json('expenses_by_type.0.type'));
    }

    public function test_dashboard_reports_and_timeline_for_september(): void
    {
        $this->at('2026-10-02 09:00:00');

        $summary = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/dashboard/summary?from=2026-09-01&to=2026-10-01')
            ->assertOk();

        $this->assertEqualsWithDelta(12568.0, $summary->json('revenue.paid'), 0.01);
        $this->assertEqualsWithDelta(500.0, $summary->json('revenue.pending'), 0.01);
        $this->assertEqualsWithDelta(360.0, $summary->json('revenue.refunded'), 0.01);
        $this->assertEqualsWithDelta(12208.0, $summary->json('revenue.net'), 0.01);

        $this->assertEqualsWithDelta(6200.0, $summary->json('expenses.paid'), 0.01);
        $this->assertEqualsWithDelta(1400.0, $summary->json('expenses.pending'), 0.01);
        $this->assertEqualsWithDelta(7600.0, $summary->json('expenses.total'), 0.01);
        $this->assertSame(2, $summary->json('expenses.overdue_count'));

        $this->assertEqualsWithDelta(4608.0, $summary->json('net'), 0.01);

        // Reservation position: 9 bookings started in September.
        $this->assertSame(9, $summary->json('reservations.by_status.completed')
            + $summary->json('reservations.by_status.cancelled')
            + $summary->json('reservations.by_status.no_show')
            + $summary->json('reservations.by_status.active'));
        $this->assertSame(5, $summary->json('reservations.by_status.completed'));
        $this->assertSame(2, $summary->json('reservations.by_status.cancelled'));
        $this->assertSame(1, $summary->json('reservations.by_status.no_show'));
        $this->assertSame(1, $summary->json('reservations.by_status.active'));

        // Fleet position and occupancy.
        $this->assertSame(3, $summary->json('fleet.total_cars'));
        $this->assertSame(1, $summary->json('fleet.currently_rented'));
        $this->assertSame(27, $summary->json('occupancy.booked_days'));
        $this->assertSame(93, $summary->json('occupancy.available_days'));
        $this->assertEqualsWithDelta(0.2903, $summary->json('occupancy.rate'), 0.0001);

        // Timeline: September carries the month's paid cash.
        $timeline = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/reports/timeline?months=6')
            ->assertOk();

        $september = array_search('2026-09', $timeline->json('months'), true);
        $this->assertNotFalse($september);
        $this->assertEqualsWithDelta(12568.0, $timeline->json("revenue.{$september}"), 0.01);
        $this->assertEqualsWithDelta(6200.0, $timeline->json("expenses.{$september}"), 0.01);

        // Per-car profitability, ranked by margin.
        $cars = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/reports/cars?from=2026-09-01&to=2026-10-01')
            ->assertOk();

        $this->assertSame((int) $this->s['carC']->id, $cars->json('0.car_id'));
        $this->assertEqualsWithDelta(6328.0, $cars->json('0.revenue'), 0.01);
        $this->assertEqualsWithDelta(2700.0, $cars->json('0.expenses'), 0.01);
        $this->assertEqualsWithDelta(3628.0, $cars->json('0.margin'), 0.01);

        $this->assertSame((int) $this->s['carB']->id, $cars->json('1.car_id'));
        $this->assertEqualsWithDelta(1460.0, $cars->json('1.margin'), 0.01);

        $this->assertSame((int) $this->s['carA']->id, $cars->json('2.car_id'));
        $this->assertEqualsWithDelta(1280.0, $cars->json('2.margin'), 0.01);

        // Per-client performance, ranked by revenue.
        $clients = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/reports/clients?from=2026-09-01&to=2026-10-01')
            ->assertOk();

        $this->assertSame((int) $this->s['c3']->id, $clients->json('0.client_id'));
        $this->assertEqualsWithDelta(5328.0, $clients->json('0.revenue'), 0.01);
        $this->assertSame((int) $this->s['c1']->id, $clients->json('1.client_id'));
        $this->assertEqualsWithDelta(3120.0, $clients->json('1.revenue'), 0.01);
        $this->assertEqualsWithDelta(1560.0, $clients->json('1.average_spend'), 0.01);
    }

    public function test_car_edit_flow_writes_the_audit_trail(): void
    {
        $this->at('2026-09-30 12:00:00');

        $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/v1/cars/{$this->s['carA']->id}", ['daily_price' => 320])
            ->assertOk()
            ->assertJsonPath('daily_price', 320);

        $this->assertSame(320.0, (float) $this->s['carA']->fresh()->daily_price);

        // The car history merges the fleet edit with reservation changes.
        $history = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carA']->id}/history")
            ->assertOk();

        $sources = collect($history->json())->pluck('source')->unique()->values()->all();
        $this->assertContains('car', $sources);
        $this->assertContains('reservation', $sources);

        $dossier = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carA']->id}/overview")
            ->assertOk();

        // Lifetime revenue for CarA excludes the refunded booking.
        $this->assertEqualsWithDelta(2880.0, $dossier->json('stats.revenue.paid'), 0.01);
        $this->assertEqualsWithDelta(360.0, $dossier->json('stats.revenue.refunded'), 0.01);
    }

    public function test_activity_trail_captures_the_month(): void
    {
        $this->at('2026-10-02 09:00:00');

        // 2 financing plans created + 9 installments settled.
        $this->assertSame(9, ActivityLog::where('module', 'financing')->where('action', 'installment_paid')->count());
        $this->assertSame(2, ActivityLog::where('module', 'financing')->where('action', 'created')->count());
        $this->assertSame(1, ActivityLog::where('module', 'payments')->where('action', 'refunded')->count());

        $feed = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/activity-logs?module=payments&action=refunded')
            ->assertOk();

        $this->assertCount(1, $feed->json('data'));
        $this->assertSame('payments', $feed->json('data.0.module'));

        $all = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/activity-logs?per_page=100')
            ->assertOk();

        $this->assertGreaterThanOrEqual(30, count($all->json('data')));
    }

    public function test_overdue_installment_sweep_flips_only_past_due_rows(): void
    {
        $this->at('2026-10-02 09:00:00');

        $second = CarInstallment::where('car_id', $this->s['carC']->id)
            ->where('installment_number', 2)
            ->sole();

        // Derived overdue already on read, stored status still pending.
        $this->assertTrue($second->isOverdue());
        $this->assertSame(InstallmentStatus::Pending, $second->status);

        $this->artisan('installments:mark-overdue')
            ->expectsOutputToContain('Marked')
            ->assertSuccessful();

        $this->assertSame(InstallmentStatus::Overdue, $second->fresh()->status);

        // The already-paid first row is untouched.
        $this->assertSame(
            InstallmentStatus::Paid,
            CarInstallment::where('car_id', $this->s['carC']->id)->where('installment_number', 1)->sole()->status,
        );
    }

    public function test_financial_data_permission_boundaries(): void
    {
        $this->at('2026-10-02 09:00:00');

        // The agent sees no financing numbers or reports...
        $this->actingAs($this->agent, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carC']->id}/statistics")
            ->assertStatus(403);

        $this->actingAs($this->agent, 'sanctum')
            ->getJson('/api/v1/reports/cars')
            ->assertStatus(403);

        $this->actingAs($this->agent, 'sanctum')
            ->postJson("/api/v1/cars/{$this->s['carB']->id}/financing", [])
            ->assertStatus(403);

        // ...but can still read the expense ledger he is allowed to see.
        $this->actingAs($this->agent, 'sanctum')
            ->getJson('/api/v1/expenses')
            ->assertOk();

        $this->actingAs($this->agent, 'sanctum')
            ->postJson('/api/v1/expenses', ['car_id' => $this->s['carA']->id])
            ->assertStatus(403);

        // Finance reads the dossier and reports.
        $this->actingAs($this->finance, 'sanctum')
            ->getJson("/api/v1/cars/{$this->s['carC']->id}/statistics")
            ->assertOk();

        $this->actingAs($this->finance, 'sanctum')
            ->getJson('/api/v1/reports/cars')
            ->assertOk();
    }

    /**
     * Build the fixture fleet: three cars, four clients, two catalog extras.
     */
    private function prepareFleet(): void
    {
        $this->s['carA'] = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'registration_number' => '1001-A-1',
            'daily_price' => 300,
            'purchase_price' => 120000,
            'status' => CarStatus::Available,
            'current_mileage' => 50000,
        ]);

        $this->s['carB'] = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'registration_number' => '2002-B-2',
            'daily_price' => 350,
            'purchase_price' => 180000,
            'status' => CarStatus::Available,
            'current_mileage' => 30000,
        ]);

        $this->s['carC'] = Car::factory()->create([
            'agency_id' => $this->agency->id,
            'registration_number' => '3003-C-3',
            'daily_price' => 600,
            'purchase_price' => 240000,
            'status' => CarStatus::Available,
            'current_mileage' => 15000,
        ]);

        foreach ([
            'c1' => ['Youssef', 'El Amrani'],
            'c2' => ['Salma', 'Bennani'],
            'c3' => ['Karim', 'Idrissi'],
            'c4' => ['Nadia', 'Cherkaoui'],
        ] as $key => [$first, $last]) {
            $this->s[$key] = Client::factory()->create([
                'agency_id' => $this->agency->id,
                'first_name' => $first,
                'last_name' => $last,
            ]);
        }

        $this->s['gps'] = Extra::factory()->create([
            'agency_id' => $this->agency->id,
            'name' => 'GPS',
            'pricing_type' => PricingType::Fixed,
            'default_price' => 100,
            'is_active' => true,
        ]);

        $this->s['chauffeur'] = Extra::factory()->create([
            'agency_id' => $this->agency->id,
            'name' => 'Chauffeur',
            'pricing_type' => PricingType::Daily,
            'default_price' => 50,
            'is_active' => true,
        ]);
    }

    /**
     * Drive the whole agency through the September 2026 month.
     */
    private function runSeptember(): void
    {
        $this->actingAs($this->admin, 'sanctum');

        // ---- Financing plans (created at the start of the month) ----------
        $this->at('2026-09-01 08:10:00');

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/cars/{$this->s['carB']->id}/financing", [
                'purchase_date' => '2026-01-15',
                'purchase_price' => 180000,
                'down_payment' => 36000,
                'installment_amount' => 12000,
                'installments_count' => 12,
                'first_due_date' => '2026-02-15',
                'lender' => 'CIH Bank',
            ])
            ->assertCreated();

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/cars/{$this->s['carC']->id}/financing", [
                'purchase_date' => '2026-08-05',
                'purchase_price' => 240000,
                'down_payment' => 48000,
                'installment_amount' => 8000,
                'installments_count' => 24,
                'first_due_date' => '2026-08-28',
                'lender' => 'Wafabail',
            ])
            ->assertCreated();

        // Settle CarB's Feb → Sep installments, and CarC's August one.
        foreach (CarInstallment::where('car_id', $this->s['carB']->id)->orderBy('installment_number')->take(8)->get() as $installment) {
            $this->at($installment->due_date->toDateString().' 10:00:00');

            $this->actingAs($this->admin, 'sanctum')
                ->postJson("/api/v1/cars/{$this->s['carB']->id}/installments/{$installment->id}/pay", [
                    'paid_date' => $installment->due_date->toDateString(),
                    'reference' => 'VIR-'.$installment->installment_number,
                ])
                ->assertOk()
                ->assertJsonPath('status', 'paid');
        }

        $firstCarC = CarInstallment::where('car_id', $this->s['carC']->id)->where('installment_number', 1)->sole();
        $this->at('2026-08-28 10:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/cars/{$this->s['carC']->id}/installments/{$firstCarC->id}/pay", [
                'paid_date' => '2026-08-28',
            ])
            ->assertOk();
        $this->actingAs($this->admin, 'sanctum');

        // ---- September rentals --------------------------------------------
        // CarA — R1: a fully-paid completed rental (initial payment).
        $this->s['r1'] = $this->createReservation('carA', 'c1', '2026-09-01 09:00:00', '2026-09-05 09:00:00', [
            'payment' => ['amount' => 1440, 'method' => 'cash', 'status' => 'paid', 'payment_date' => '2026-09-01'],
        ]);
        $this->confirm('r1', '2026-09-01 09:00:00');
        $this->activate('r1', '2026-09-01 09:00:00', 50000, 95);
        $this->complete('r1', '2026-09-05 09:00:00', 50400, 70);

        // CarA — R2: balance split across two payments.
        $this->s['r2'] = $this->createReservation('carA', 'c2', '2026-09-08 09:00:00', '2026-09-12 09:00:00');
        $this->confirm('r2', '2026-09-08 09:00:00');
        $this->activate('r2', '2026-09-08 09:00:00', 50400, 90);
        $this->pay('r2', 1000, 'card', 'paid', '2026-09-08');
        $this->pay('r2', 440, 'cash', 'paid', '2026-09-12');
        $this->complete('r2', '2026-09-12 09:00:00', 50800, 65);

        // CarA — R3: a confirmed booking that the client cancelled.
        $this->s['r3'] = $this->createReservation('carA', 'c3', '2026-09-20 09:00:00', '2026-09-24 09:00:00');
        $this->confirm('r3', '2026-09-20 09:00:00');
        $this->at('2026-09-20 10:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s['r3']}/cancel", ['reason' => 'Client cancelled the reservation'])
            ->assertOk();

        // CarB — R4: transfer recorded pending, confirmed the next day.
        $this->s['r4'] = $this->createReservation('carB', 'c1', '2026-09-03 09:00:00', '2026-09-07 09:00:00', [
            'payment' => ['amount' => 1680, 'method' => 'transfer', 'status' => 'pending', 'payment_date' => '2026-09-03'],
        ]);
        $this->confirm('r4', '2026-09-03 09:00:00');
        $this->activate('r4', '2026-09-03 09:00:00', 30000, 80);
        $this->at('2026-09-04 10:00:00');
        $r4Payment = Payment::where('reservation_id', $this->s['r4'])->sole();
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/payments/{$r4Payment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('status', 'paid');
        $this->complete('r4', '2026-09-07 09:00:00', 30450, 60);

        // CarB — R5: paid off across the rental window.
        $this->s['r5'] = $this->createReservation('carB', 'c4', '2026-09-15 09:00:00', '2026-09-19 09:00:00');
        $this->confirm('r5', '2026-09-15 09:00:00');
        $this->activate('r5', '2026-09-15 09:00:00', 30450, 85);
        $this->pay('r5', 1000, 'cash', 'paid', '2026-09-15');
        $this->pay('r5', 680, 'cash', 'paid', '2026-09-19');
        $this->complete('r5', '2026-09-19 09:00:00', 30900, 55);

        // CarB — R6: the client never showed up.
        $this->s['r6'] = $this->createReservation('carB', 'c2', '2026-09-25 09:00:00', '2026-09-29 09:00:00');
        $this->confirm('r6', '2026-09-25 09:00:00');
        $this->at('2026-09-25 10:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s['r6']}/no-show", ['reason' => 'Client never collected the car'])
            ->assertOk();

        // CarC — R7: a week-long rental with catalog extras, settled at dropoff.
        $this->s['r7'] = $this->createReservation('carC', 'c3', '2026-09-10 09:00:00', '2026-09-17 09:00:00', [
            'extras' => [
                ['extra_id' => $this->s['gps']->id, 'quantity' => 1],
                ['extra_id' => $this->s['chauffeur']->id, 'quantity' => 1],
            ],
        ]);
        $this->confirm('r7', '2026-09-10 09:00:00');
        $this->activate('r7', '2026-09-10 09:00:00', 15000, 100);
        $this->pay('r7', 5328, 'cash', 'paid', '2026-09-17');
        $this->complete('r7', '2026-09-17 09:00:00', 15600, 55);

        // CarC — R8: an active rental that crosses into October.
        $this->s['r8'] = $this->createReservation('carC', 'c4', '2026-09-28 09:00:00', '2026-10-03 09:00:00');
        $this->confirm('r8', '2026-09-28 09:00:00');
        $this->activate('r8', '2026-09-28 09:00:00', 15600, 100);
        $this->pay('r8', 1000, 'cash', 'paid', '2026-09-28');
        $this->pay('r8', 500, 'transfer', 'pending', '2026-09-30');

        // CarA — R10: booked, paid, then cancelled + refunded.
        $this->s['r10'] = $this->createReservation('carA', 'c1', '2026-09-29 09:00:00', '2026-09-30 09:00:00');
        $this->confirm('r10', '2026-09-29 09:00:00');
        $this->pay('r10', 360, 'cash', 'paid', '2026-09-29');
        $this->at('2026-09-30 10:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s['r10']}/cancel", ['reason' => 'Client cancelled last minute']);
        $refund = Payment::where('reservation_id', $this->s['r10'])->sole();
        $this->at('2026-09-30 11:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/payments/{$refund->id}/refund", ['reason' => 'Cancellation refund'])
            ->assertOk()
            ->assertJsonPath('status', 'refunded');

        // CarA — R9: an upcoming confirmed booking for early October.
        $this->s['r9'] = $this->createReservation('carA', 'c1', '2026-10-05 09:00:00', '2026-10-08 09:00:00');
        $this->at('2026-09-30 12:00:00');
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s['r9']}/confirm")
            ->assertOk();

        // ---- Expenses ------------------------------------------------------
        $this->expense('carA', ExpenseType::Insurance, 'Annual insurance premium', 1200, 'paid', [
            'paid_date' => '2026-09-02', 'created_at' => '2026-09-01 10:00:00',
        ]);
        $this->expense('carA', ExpenseType::OilChange, 'Oil change', 400, 'paid', [
            'paid_date' => '2026-09-15', 'created_at' => '2026-09-15 10:00:00',
        ]);
        $this->expense('carA', ExpenseType::Repair, 'Brake pads', 900, 'pending', [
            'due_date' => '2026-09-30', 'start_date' => '2026-09-28', 'created_at' => '2026-09-25 10:00:00',
        ]);
        $this->expense('carB', ExpenseType::Tires, 'Four new tyres', 1600, 'paid', [
            'paid_date' => '2026-09-10', 'created_at' => '2026-09-10 10:00:00',
        ]);
        $this->expense('carB', ExpenseType::Inspection, 'Technical inspection', 300, 'paid', [
            'paid_date' => '2026-09-18', 'created_at' => '2026-09-18 10:00:00',
        ]);
        $this->expense('carB', ExpenseType::Maintenance, 'Scheduled maintenance', 500, 'pending', [
            'due_date' => '2026-09-20', 'start_date' => '2026-09-19', 'created_at' => '2026-09-19 10:00:00',
        ]);
        $this->expense('carC', ExpenseType::Insurance, 'Insurance premium', 2000, 'paid', [
            'paid_date' => '2026-09-05', 'created_at' => '2026-09-05 10:00:00',
        ]);
        $this->expense('carC', ExpenseType::Maintenance, 'Suspension service', 700, 'paid', [
            'paid_date' => '2026-09-25', 'start_date' => '2026-09-23', 'due_date' => '2026-09-26',
            'created_at' => '2026-09-23 10:00:00',
        ]);

        // ---- Close the month ----------------------------------------------
        $this->at('2026-10-02 09:00:00');
    }

    private function createReservation(string $carKey, string $clientKey, string $pickup, string $return, array $overrides = []): int
    {
        $payload = array_merge([
            'car_id' => $this->s[$carKey]->id,
            'primary_client_id' => $this->s[$clientKey]->id,
            'pickup_datetime' => $pickup,
            'expected_return_datetime' => $return,
            'deposit_amount' => 0,
        ], $overrides);

        return $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/reservations', $payload)
            ->assertCreated()
            ->json('id');
    }

    private function confirm(string $reservationKey, string $at): void
    {
        $this->at($at);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s[$reservationKey]}/confirm")
            ->assertOk();
    }

    private function activate(string $reservationKey, string $at, int $mileage, int $fuel): void
    {
        $this->at($at);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s[$reservationKey]}/activate", [
                'pickup_mileage' => $mileage,
                'pickup_fuel_level' => $fuel,
            ])
            ->assertOk();
    }

    private function complete(string $reservationKey, string $at, int $mileage, int $fuel): void
    {
        $this->at($at);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s[$reservationKey]}/complete", [
                'return_mileage' => $mileage,
                'return_fuel_level' => $fuel,
            ])
            ->assertOk();
    }

    private function pay(string $reservationKey, float $amount, string $method, string $status, string $date): void
    {
        $this->at($date.' 09:30:00');

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/reservations/{$this->s[$reservationKey]}/payments", [
                'amount' => $amount,
                'method' => $method,
                'status' => $status,
                'payment_date' => $date,
            ])
            ->assertCreated();
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function expense(string $carKey, ExpenseType $type, string $title, float $amount, string $status, array $overrides = []): int
    {
        $createdAt = $overrides['created_at'] ?? '2026-09-15 10:00:00';
        unset($overrides['created_at']);

        $this->at($createdAt);

        $payload = array_merge([
            'car_id' => $this->s[$carKey]->id,
            'type' => $type->value,
            'title' => $title,
            'amount' => $amount,
            'status' => $status,
            'vendor' => 'Atlas Suppliers',
        ], $overrides);

        return $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/expenses', $payload)
            ->assertCreated()
            ->json('id');
    }
}
