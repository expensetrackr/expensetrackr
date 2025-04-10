<?php

declare(strict_types=1);

namespace App\Enums\Banking;

enum TellerTransactionStatus: string
{
    case Posted = 'posted';
    case Pending = 'pending';
}
