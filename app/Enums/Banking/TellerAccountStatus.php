<?php

declare(strict_types=1);

namespace App\Enums\Banking;

use Filament\Support\Contracts\HasLabel;

enum TellerAccountStatus: string implements HasLabel
{
    case Open = 'open';
    case Closed = 'closed';

    public function getLabel(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::Closed => 'Closed',
        };
    }
}
