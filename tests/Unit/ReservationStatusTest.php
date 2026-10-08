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
        $this->assertTrue(ReservationStatus::NoShow->isTerminal());

        $this->assertFalse(ReservationStatus::Pending->isTerminal());
        $this->assertFalse(ReservationStatus::Confirmed->isTerminal());
        $this->assertFalse(ReservationStatus::Reserved->isTerminal());
        $this->assertFalse(ReservationStatus::Active->isTerminal());
    }

    public function test_only_terminal_states_release_the_car(): void
    {
        $this->assertFalse(ReservationStatus::Completed->blocksAvailability());
        $this->assertFalse(ReservationStatus::Cancelled->blocksAvailability());
        $this->assertFalse(ReservationStatus::NoShow->blocksAvailability());

        $this->assertTrue(ReservationStatus::Pending->blocksAvailability());
        $this->assertTrue(ReservationStatus::Confirmed->blocksAvailability());
        $this->assertTrue(ReservationStatus::Reserved->blocksAvailability());
        $this->assertTrue(ReservationStatus::Active->blocksAvailability());
    }

    public function test_blocking_status_set_matches_availability_rule(): void
    {
        $blocking = array_map(
            fn (ReservationStatus $status) => $status->value,
            ReservationStatus::blocking(),
        );

        $this->assertSame(['pending', 'confirmed', 'reserved', 'active'], $blocking);
    }

    public function test_pending_can_move_to_confirmed_reserved_cancelled_or_no_show(): void
    {
        $this->assertTrue(ReservationStatus::Pending->canTransitionTo(ReservationStatus::Confirmed));
        $this->assertTrue(ReservationStatus::Pending->canTransitionTo(ReservationStatus::Reserved));
        $this->assertTrue(ReservationStatus::Pending->canTransitionTo(ReservationStatus::Cancelled));
        $this->assertTrue(ReservationStatus::Pending->canTransitionTo(ReservationStatus::NoShow));

        $this->assertFalse(ReservationStatus::Pending->canTransitionTo(ReservationStatus::Active));
    }

    public function test_reserved_can_be_confirmed_activated_cancelled_or_no_show(): void
    {
        $this->assertTrue(ReservationStatus::Reserved->canTransitionTo(ReservationStatus::Confirmed));
        $this->assertTrue(ReservationStatus::Reserved->canTransitionTo(ReservationStatus::Active));
        $this->assertTrue(ReservationStatus::Reserved->canTransitionTo(ReservationStatus::Cancelled));
        $this->assertTrue(ReservationStatus::Reserved->canTransitionTo(ReservationStatus::NoShow));

        $this->assertFalse(ReservationStatus::Reserved->canTransitionTo(ReservationStatus::Completed));
    }

    public function test_confirmed_can_activate_cancel_or_no_show(): void
    {
        $this->assertTrue(ReservationStatus::Confirmed->canTransitionTo(ReservationStatus::Active));
        $this->assertTrue(ReservationStatus::Confirmed->canTransitionTo(ReservationStatus::Cancelled));
        $this->assertTrue(ReservationStatus::Confirmed->canTransitionTo(ReservationStatus::NoShow));

        $this->assertFalse(ReservationStatus::Confirmed->canTransitionTo(ReservationStatus::Pending));
    }

    public function test_active_can_only_complete(): void
    {
        $this->assertTrue(ReservationStatus::Active->canTransitionTo(ReservationStatus::Completed));

        $this->assertFalse(ReservationStatus::Active->canTransitionTo(ReservationStatus::NoShow));
        $this->assertFalse(ReservationStatus::Active->canTransitionTo(ReservationStatus::Cancelled));
    }

    public function test_terminal_states_accept_no_further_transitions(): void
    {
        foreach ([ReservationStatus::Completed, ReservationStatus::Cancelled, ReservationStatus::NoShow] as $status) {
            foreach (ReservationStatus::cases() as $target) {
                $this->assertFalse($status->canTransitionTo($target));
            }
        }
    }
}
