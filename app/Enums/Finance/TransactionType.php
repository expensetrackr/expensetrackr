<?php

declare(strict_types=1);

namespace App\Enums\Finance;

enum TransactionType: string
{
    case Income = 'income';
    case Expense = 'expense';
    case Transfer = 'transfer';
}
