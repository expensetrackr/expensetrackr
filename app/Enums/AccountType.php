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
