<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum ProductPriceType: string
{
    case RECURRING = 'recurring';
    case ONE_TIME = 'one_time';
}
