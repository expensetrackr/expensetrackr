<?php

declare(strict_types=1);

namespace App\Enums;

enum ProviderType: string
{
    case Teller = 'teller';
    case Mx = 'mx';

    /**
     * Get all values as an array
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable label for the enum value
     */
    public function label(): string
    {
        return match ($this) {
            self::Teller => 'Teller',
            self::Mx => 'MX',
        };
    }
}
