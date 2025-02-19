<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum DiscountDuration: string
{
    case ONCE = 'once';
    case FOREVER = 'forever';
    case REPEATING = 'repeating';
}
