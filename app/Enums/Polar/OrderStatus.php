<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum OrderStatus: string
{
    case PAID = 'paid';
    case REFUNDED = 'refunded';
    case PARTIALLY_REFUNDED = 'partially_refunded';
}
