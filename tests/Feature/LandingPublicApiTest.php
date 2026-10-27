<?php

namespace Tests\Feature;

use App\Enums\CarStatus;
use App\Models\Agency;
use App\Models\Car;
use App\Models\CarImage;
use App\Models\Currency;
use App\Models\QrCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPublicApiTest extends TestCase
{
    use RefreshDatabase;

    private Agency $agency;

    protected function setUp(): void
    {
        parent::setUp();

        $this->agency = Agency::factory()->create([
            'currency_id' => Currency::factory()->create(['code' => 'MAD'])->id,
        ]);
    }

    private function car(array $attributes = []): Car
    {
        return Car::factory()->create(array_merge([
            'agency_id' => $this->agency->id,
            'daily_price' => 350,
            'status' => CarStatus::Available,
        ], $attributes));
    }

    private function qr(string $name, array $carIds = []): QrCode
    {
        return tap(
            QrCode::factory()->create(['agency_id' => $this->agency->id, 'name' => $name]),
            fn (QrCode $qr) => $qr->cars()->sync($carIds),
        );
    }

    // ------------------------------------------------------------------ cars

    public function test_landing_lists_the_selection_by_car_slugs(): void
    {
        $listed = $this->car(['daily_price' => 300]);
        $this->car(['daily_price' => 500]);
        CarImage::factory()->create(['car_id' => $listed->id, 'is_primary' => true]);

        $this->getJson("/api/v1/landing/cars?cars={$listed->slug}")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $listed->id)
            ->assertJsonPath('0.slug', $listed->slug)
            ->assertJsonPath('0.daily_price', 300)
            ->assertJsonPath('0.agency.name', $this->agency->name)
            ->assertJsonPath('0.agency.currency_code', 'MAD');
    }

    public function test_landing_omits_cars_that_are_not_rentable(): void
    {
        $rented = $this->car(['status' => CarStatus::Rented]);
        $inactive = $this->car(['is_active' => false]);

        $this->getJson("/api/v1/landing/cars?cars={$rented->slug},{$inactive->slug}")
            ->assertOk()
            ->assertJsonCount(0);
    }

    public function test_landing_accepts_a_comma_separated_slug_selection(): void
    {
        $first = $this->car();
        $second = $this->car();

        $this->getJson("/api/v1/landing/cars?cars={$second->slug},{$first->slug},{$second->slug}")
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_landing_lists_the_fleet_saved_on_a_qr_page(): void
    {
        $this->qr('Unlinked poster');
        $qr = $this->qr('Showroom Casablanca', [
            $this->car(['daily_price' => 300])->id,
            $this->car(['daily_price' => 500])->id,
        ]);
        $this->car(['daily_price' => 700, 'status' => CarStatus::Maintenance]);

        $this->getJson("/api/v1/landing/cars?qr={$qr->slug}")
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.daily_price', 300)
            ->assertJsonPath('1.daily_price', 500);
    }

    public function test_landing_shows_an_empty_catalog_for_an_unknown_qr_page(): void
    {
        $this->getJson('/api/v1/landing/cars?qr=nobody-posted-this')
            ->assertOk()
            ->assertJsonCount(0);
    }

    public function test_landing_cars_query_requires_a_selection(): void
    {
        $this->getJson('/api/v1/landing/cars')->assertStatus(422);
        $this->getJson('/api/v1/landing/cars?cars=Not%20A%20Slug')->assertStatus(422);
        $this->getJson('/api/v1/landing/cars?qr=')->assertStatus(422);
        $this->getJson('/api/v1/landing/cars?ids=1,2')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['cars', 'qr']);
    }

    // ----------------------------------------------------------- reservations

    public function test_landing_reservation_is_stored_with_the_car_agency(): void
    {
        $car = $this->car();

        $this->postJson('/api/v1/landing/reservations', [
            'car_id' => $car->id,
            'full_name' => 'Khalid Amrani',
            'phone' => '+212 6 12 34 56 78',
            'email' => 'khalid@example.com',
            'pickup_datetime' => now()->addDay()->toDateTimeString(),
            'expected_return_datetime' => now()->addDays(5)->toDateTimeString(),
            'message' => 'Call me after 6pm.',
        ])
            ->assertCreated()
            ->assertJsonPath('message', 'Your reservation request has been received.');

        $this->assertDatabaseHas('landing_reservations', [
            'agency_id' => $this->agency->id,
            'car_id' => $car->id,
            'full_name' => 'Khalid Amrani',
            // Source marker: every row in this table comes from the landing.
            'status' => 'new',
        ]);
    }

    public function test_landing_reservation_validates_contact_fields(): void
    {
        $this->postJson('/api/v1/landing/reservations', ['car_id' => $this->car()->id])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['full_name', 'phone']);

        $this->postJson('/api/v1/landing/reservations', ['car_id' => 9_999_999])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_id']);
    }

    public function test_landing_reservation_rejects_unavailable_cars(): void
    {
        $car = $this->car(['status' => CarStatus::Maintenance]);

        $this->postJson('/api/v1/landing/reservations', [
            'car_id' => $car->id,
            'full_name' => 'Khalid Amrani',
            'phone' => '+212 6 12 34 56 78',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['car_id']);
    }
}
