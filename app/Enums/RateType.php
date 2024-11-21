<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum RateType: string
{
    use InteractWithEnum;

    case Fixed = 'fixed';
    case Variable = 'variable';
    case Adjustable = 'adjustable';
}
