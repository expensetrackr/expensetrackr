<?php

declare(strict_types=1);

namespace App\Enums\Finance;

use Kongulov\Traits\InteractWithEnum;

enum TransactionRecurringInterval: string
{
    use InteractWithEnum;

    case Daily = 'daily';
    case Weekly = 'weekly';
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';
    case Yearly = 'yearly';
}
