<?php

declare(strict_types=1);

namespace App\Enums\Banking;

use Filament\Support\Contracts\HasLabel;

enum TellerAccountSubtype: string implements HasLabel
{
    case Checking = 'checking';
    case Savings = 'savings';
    case MoneyMarket = 'money_market';
    case CertificateOfDeposit = 'certificate_of_deposit';
    case Treasury = 'treasury';
    case Sweep = 'sweep';
    case CreditCard = 'credit_card';

    public function getLabel(): string
    {
        return match ($this) {
            self::Checking => 'Checking',
            self::Savings => 'Savings',
            self::MoneyMarket => 'Money Market',
            self::CertificateOfDeposit => 'Certificate of Deposit',
            self::Treasury => 'Treasury',
            self::Sweep => 'Sweep',
            self::CreditCard => 'Credit Card',
        };
    }
}
