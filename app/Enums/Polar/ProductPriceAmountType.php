<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum ProductPriceAmountType: string
{
    case FIXED = 'fixed';
    case CUSTOM = 'custom';
    case FREE = 'free';
}
