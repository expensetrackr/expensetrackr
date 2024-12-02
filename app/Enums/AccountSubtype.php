<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum AccountSubtype: string
{
    use InteractWithEnum;

    // Depository
    case None = 'none';
    case Checking = 'checking';
    case Savings = 'savings';

    // Investment
    case Brokerage = 'brokerage';
    case Pension = 'pension';
    case Retirement = 'retirement';
    case Four01k = '401k';
    case TraditionalFour01k = 'traditional_401k';
    case RothFour01k = 'roth_401k';
    case Five29Plan = '529_plan';
    case HealthSavingsAccount = 'hsa';
    case MutualFund = 'mutual_fund';
    case TraditionalIRA = 'traditional_ira';
    case RothIRA = 'roth_ira';
    case Angel = 'angel';
}
