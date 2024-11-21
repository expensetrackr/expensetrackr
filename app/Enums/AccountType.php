<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum AccountType: string
{
    use InteractWithEnum;

    case Depository = 'depository';
    case Investment = 'investment';
    case Crypto = 'crypto';
    case OtherAsset = 'other_asset';

    case CreditCard = 'credit_card';
    case Loan = 'loan';
    case OtherLiability = 'other_liability';

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
