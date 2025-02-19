<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum DiscountType: string
{
    case FIXED = 'fixed';
    case PERCENTAGE = 'percentage';
}
