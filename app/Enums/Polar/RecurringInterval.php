<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum RecurringInterval: string
{
    case MONTH = 'month';
    case YEAR = 'year';
}
