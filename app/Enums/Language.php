<?php

namespace App\Enums;

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
