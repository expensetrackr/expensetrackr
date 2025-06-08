<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class InvalidTransactionTypeException extends Exception
{
    /**
     * Create an exception for when an invalid transaction type is encountered.
     */
    public static function forType(string $transactionType): self
    {
        return new self("Invalid transaction type: {$transactionType}");
    }
}
