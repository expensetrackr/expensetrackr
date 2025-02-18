<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Database\Eloquent\Model;

final class InvalidCustomer extends Exception
{
    public static function notYetCreated(Model $owner): self
    {
        return new self(class_basename($owner).' is not a Polar customer yet.');
    }
}
