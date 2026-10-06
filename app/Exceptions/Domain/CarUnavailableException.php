<?php

namespace App\Exceptions\Domain;

class CarUnavailableException extends DomainException
{
    /**
     * @param  array<int, array{reservation_number: string, status: string, pickup_datetime: string, expected_return_datetime: string}>  $conflicts
     */
    public function __construct(private readonly array $conflicts)
    {
        parent::__construct(
            'The selected car is not available for the requested period.',
            'car_unavailable',
            409,
        );
    }

    public function context(): array
    {
        return ['conflicts' => $this->conflicts];
    }
}
