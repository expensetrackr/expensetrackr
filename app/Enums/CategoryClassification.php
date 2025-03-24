<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum CategoryClassification: string
{
    use InteractWithEnum;

    case Income = 'income';
    case Expense = 'expense';
    case Transfer = 'transfer';
    case Other = 'other';
}
