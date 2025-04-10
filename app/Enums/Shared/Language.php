<?php

declare(strict_types=1);

namespace App\Enums\Shared;

use Filament\Support\Contracts\HasLabel;

enum Language: string implements HasLabel
{
    case EN = 'en';
    case ES = 'es';

    public function getLabel(): string
    {
        return match ($this) {
            self::EN => 'English',
            self::ES => 'Español',
        };
    }
}
