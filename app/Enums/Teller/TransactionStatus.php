<?php

declare(strict_types=1);

namespace App\Enums\Teller;

enum TransactionStatus: string
{
    case Posted = 'posted';
    case Pending = 'pending';
}
