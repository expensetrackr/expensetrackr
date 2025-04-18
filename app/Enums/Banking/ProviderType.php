<?php

declare(strict_types=1);

namespace App\Enums\Banking;

use Kongulov\Traits\InteractWithEnum;

enum ProviderType: string
{
    use InteractWithEnum;

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
