<?php

declare(strict_types=1);

namespace App\Enums\Finance;

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

    /**
     * Create an enum instance from a string value, with support for external type mapping
     */
    public static function fromExternal(string $type): self
    {
        $mappedType = match ($type) {
            'money_market' => self::None->value,
            'certificate_of_deposit' => self::None->value,
            'treasury' => self::None->value,
            'sweep' => self::None->value,
            'credit_card' => self::None->value,
            default => $type,
        };

        return self::from($mappedType);
    }
}
