<?php

declare(strict_types=1);

namespace App\Enums\Finance;

use Kongulov\Traits\InteractWithEnum;

enum AccountSubtype: string
{
    use InteractWithEnum;

    /**
     * A none subtype is a type of account that has no subtype.
     */
    case None = 'none';

    /**
     * A checking account is a type of account that allows you to write checks and make deposits.
     */
    case Checking = 'checking';

    /**
     * A savings account is a type of account that allows you to save money.
     */
    case Savings = 'savings';

    /**
     * A brokerage account is a type of account that allows you to trade stocks, bonds, or other investments.
     */
    case Brokerage = 'brokerage';

    /**
     * A pension account is a type of account that allows you to save for retirement.
     */
    case Pension = 'pension';

    /**
     * A retirement account is a type of account that allows you to save for retirement.
     */
    case Retirement = 'retirement';

    /**
     * A 401k account is a type of account that allows you to save for retirement.
     */
    case Four01k = '401k';

    /**
     * A traditional 401k account is a type of account that allows you to save for retirement.
     */
    case TraditionalFour01k = 'traditional_401k';

    /**
     * A Roth 401k account is a type of account that allows you to save for retirement.
     */
    case RothFour01k = 'roth_401k';

    /**
     * A 529 plan account is a type of account that allows you to save for education.
     */
    case Five29Plan = '529_plan';

    /**
     * A health savings account is a type of account that allows you to save for healthcare.
     */
    case HealthSavingsAccount = 'hsa';

    /**
     * A mutual fund account is a type of account that allows you to invest in a mutual fund.
     */
    case MutualFund = 'mutual_fund';

    /**
     * A traditional IRA account is a type of account that allows you to save for retirement.
     */
    case TraditionalIRA = 'traditional_ira';

    /**
     * A Roth IRA account is a type of account that allows you to save for retirement.
     */
    case RothIRA = 'roth_ira';

    /**
     * An angel account is a type of account that allows you to invest in an angel.
     */
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
