<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum AccountType: string
{
    use InteractWithEnum;

    case Credit = 'credit';
    case Depository = 'depository';
    case Investment = 'investment';
    case Loan = 'loan';
    case Cash = 'cash';
    case Other = 'other';
}
