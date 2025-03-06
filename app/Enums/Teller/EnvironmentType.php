<?php

declare(strict_types=1);

namespace App\Enums\Teller;

use Kongulov\Traits\InteractWithEnum;

enum EnvironmentType: string
{
    use InteractWithEnum;

    case Sandbox = 'sandbox';
    case Development = 'development';
    case Production = 'production';
}
