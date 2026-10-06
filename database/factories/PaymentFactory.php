<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentRecordStatus;
use App\Models\Agency;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'agency_id' => Agency::factory(),
            'reservation_id' => Reservation::factory(),
            'payment_date' => now(),
            'amount' => 900,
            'method' => PaymentMethod::Cash,
            'reference' => null,
            'status' => PaymentRecordStatus::Paid,
            'notes' => null,
            'created_by' => User::factory(),
        ];
    }
}
