<?php

declare(strict_types=1);

namespace App\Enums\Finance;

enum TransactionStatus: string
{
    case Posted = 'posted';
    case Pending = 'pending';
    case Excluded = 'excluded';
    case Completed = 'completed';
}
