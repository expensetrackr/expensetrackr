<?php

declare(strict_types=1);

namespace App\Enums\Teller;

use Filament\Support\Contracts\HasLabel;

enum AccountStatus: string implements HasLabel
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
