<?php

namespace Tests\Feature;

use App\Enums\ReservationStatus;
use App\Models\Car;
use App\Models\Reservation;
use App\Support\Tenancy\AgencyContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationSchemaTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        app(AgencyContext::class)->clear();

        parent::tearDown();
    }

    public function test_reservation_persists_with_its_relations(): void
    {
        $reservation = Reservation::factory()->create();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'reservation_number' => $reservation->reservation_number,
        ]);

        $this->assertSame($reservation->car_id, $reservation->car->id);
        $this->assertSame($reservation->primary_client_id, $reservation->primaryClient->id);
        $this->assertSame($reservation->created_by, $reservation->createdBy->id);
        $this->assertSame(ReservationStatus::Pending, $reservation->status);
    }

    public function test_agency_context_scopes_queries_and_autofills_new_rows(): void
    {
        $first = Reservation::factory()->create();
        $second = Reservation::factory()->create();

        $this->assertSame(2, Reservation::count());

        $context = app(AgencyContext::class);
        $context->set((int) $first->agency_id);

        $this->assertSame(1, Reservation::count());
        // fresh() bypasses global scopes by design — scoped queries must be the ones hiding it.
        $this->assertNull(Reservation::query()->find($second->id));

        // New rows inherit the agency from context instead of the factory default.
        $car = Car::factory()->create(['agency_id' => null]);
        $this->assertSame((int) $first->agency_id, (int) $car->agency_id);

        $context->clear();

        $this->assertSame(2, Reservation::count());
        $this->assertSame(3, Car::count());
    }

    public function test_overlapping_scope_flags_conflicting_windows_only(): void
    {
        $reservation = Reservation::factory()->confirmed()->create();

        // Window strictly inside the reservation: conflict.
        $conflicting = Reservation::query()
            ->overlapping(
                $reservation->car_id,
                $reservation->pickup_datetime->copy()->addDay(),
                $reservation->expected_return_datetime->copy()->subDay(),
            )
            ->count();

        $this->assertSame(1, $conflicting);

        // Window after the expected return: no conflict.
        $later = Reservation::query()
            ->overlapping(
                $reservation->car_id,
                $reservation->expected_return_datetime->copy()->addHour(),
                $reservation->expected_return_datetime->copy()->addDays(3),
            )
            ->count();

        $this->assertSame(0, $later);

        // Back-to-back: a rental starting exactly when this one ends is allowed.
        $boundary = Reservation::query()
            ->overlapping(
                $reservation->car_id,
                $reservation->expected_return_datetime,
                $reservation->expected_return_datetime->copy()->addDays(2),
            )
            ->count();

        $this->assertSame(0, $boundary);
    }

    public function test_cancelled_reservations_do_not_block_availability(): void
    {
        $cancelled = Reservation::factory()->create(['status' => ReservationStatus::Cancelled]);

        $count = Reservation::query()
            ->overlapping($cancelled->car_id, $cancelled->pickup_datetime, $cancelled->expected_return_datetime)
            ->count();

        $this->assertSame(0, $count);
    }
}
