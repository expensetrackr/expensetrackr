<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum PaymentProcessor: string
{
    case STRIPE = 'stripe';
}
