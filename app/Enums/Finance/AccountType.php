<?php

declare(strict_types=1);

namespace App\Enums\Finance;

use Kongulov\Traits\InteractWithEnum;

enum AccountType: string
{
    use InteractWithEnum;

    /**
     * A depository account is a type of account that holds cash or other liquid assets.
     */
    case Depository = 'depository';

    /**
     * An investment account is a type of account that holds stocks, bonds, or other investments.
     */
    case Investment = 'investment';

    /**
     * A crypto account is a type of account that holds cryptocurrencies.
     */
    case Crypto = 'crypto';

    /**
     * An other asset account is a type of account that holds other assets.
     */
    case OtherAsset = 'other_asset';

    /**
     * A credit card account is a type of account that allows you to borrow money from a bank.
     */
    case CreditCard = 'credit_card';

    /**
     * A loan account is a type of account that holds a loan.
     */
    case Loan = 'loan';

    /**
     * An other liability account is a type of account that holds other liabilities.
     */
    case OtherLiability = 'other_liability';

    /**
     * Create an enum instance from a string value, with support for external type mapping
     */
    public static function fromExternal(string $type): self
    {
        $mappedType = match ($type) {
            'credit' => self::CreditCard->value,
            default => $type,
        };

        return self::from($mappedType);
    }

    /**
     * Get all asset account types.
     *
     * @return array<int, self>
     */
    public static function assets(): array
    {
        return [
            self::Depository,
            self::Investment,
            self::Crypto,
            self::OtherAsset,
        ];
    }

    /**
     * Get all liability account types.
     *
     * @return array<int, self>
     */
    public static function liabilities(): array
    {
        return [
            self::CreditCard,
            self::Loan,
            self::OtherLiability,
        ];
    }

    /**
     * Checks if the current account type is an asset.
     */
    public function isAsset(): bool
    {
        return in_array($this, self::assets());
    }

    /**
     * Checks if the current account type is a liability.
     */
    public function isLiability(): bool
    {
        return in_array($this, self::liabilities());
    }
}
