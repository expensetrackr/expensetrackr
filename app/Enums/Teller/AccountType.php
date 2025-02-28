<?php

declare(strict_types=1);

namespace App\Enums\Teller;

use Filament\Support\Contracts\HasLabel;

enum AccountType: string implements HasLabel
{
    case Depository = 'depository';
    case Credit = 'credit';

    public function getLabel(): string
    {
        return match ($this) {
            self::Depository => 'Depository',
            self::Credit => 'Credit',
        };
    }
}
