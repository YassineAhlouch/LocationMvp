<?php

namespace Tests\Unit;

use App\Enums\ReservationStatus;
use PHPUnit\Framework\TestCase;

class ReservationStatusTest extends TestCase
{
    public function test_terminal_states_cannot_transition_further(): void
    {
        $this->assertTrue(ReservationStatus::Completed->isTerminal());
        $this->assertTrue(ReservationStatus::Cancelled->isTerminal());

        $this->assertFalse(ReservationStatus::Pending->isTerminal());
        $this->assertFalse(ReservationStatus::Confirmed->isTerminal());
        $this->assertFalse(ReservationStatus::Active->isTerminal());
    }

    public function test_only_terminal_states_release_the_car(): void
    {
        $this->assertFalse(ReservationStatus::Completed->blocksAvailability());
        $this->assertFalse(ReservationStatus::Cancelled->blocksAvailability());

        $this->assertTrue(ReservationStatus::Pending->blocksAvailability());
        $this->assertTrue(ReservationStatus::Confirmed->blocksAvailability());
        $this->assertTrue(ReservationStatus::Active->blocksAvailability());
    }

    public function test_blocking_status_set_matches_availability_rule(): void
    {
        $blocking = array_map(
            fn (ReservationStatus $status) => $status->value,
            ReservationStatus::blocking(),
        );

        $this->assertSame(['pending', 'confirmed', 'active'], $blocking);
    }
}
