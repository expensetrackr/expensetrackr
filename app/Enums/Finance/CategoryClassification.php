<?php

declare(strict_types=1);

namespace App\Enums\Finance;

use Kongulov\Traits\InteractWithEnum;

enum CategoryClassification: string
{
    use InteractWithEnum;

    /**
     * Income or earnings.
     */
    case Income = 'income';

    /**
     * Expenses or costs.
     */
    case Expense = 'expense';

    /**
     * Transfers between accounts.
     */
    case Transfer = 'transfer';

    /**
     * Savings or investing activities, distinct from regular expenses.
     */
    case Savings = 'savings';

    /**
     * Other or miscellaneous activities.
     */
    case Other = 'other';

}
