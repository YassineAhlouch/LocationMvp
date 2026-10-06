<?php

namespace App\Exceptions\Domain;

use RuntimeException;

/**
 * Base for all business-rule violations. Each subclass fixes its stable
 * machine-readable code and HTTP status; bootstrap/app.php renders the
 * family as {message, code, ...context} so the React client branches on
 * `code`, never on message text.
 */
abstract class DomainException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly string $errorCode,
        private readonly int $httpStatus = 422,
    ) {
        parent::__construct($message);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    public function httpStatus(): int
    {
        return $this->httpStatus;
    }

    /**
     * Extra payload merged into the JSON body (and exception log context).
     *
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return [];
    }
}
