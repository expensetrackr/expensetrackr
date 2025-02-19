<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum CheckoutStatus: string
{
    case OPEN = 'open';
    case EXPIRED = 'expired';
    case CONFIRMED = 'confirmed';
    case SUCCEEDED = 'succeeded';
    case FAILED = 'failed';
}
