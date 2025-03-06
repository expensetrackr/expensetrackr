<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class MissingTellerConfigurationException extends Exception
{
    public function render()
    {
        return response("The teller configuration file is missing. Please run 'php artisan vendor:publish --tag=teller-sdk-config' to generate.", 404);
    }
}
