<?php

declare(strict_types=1);

namespace App\Enums;

use Kongulov\Traits\InteractWithEnum;

enum ConnectionStatus: string
{
    use InteractWithEnum;

    case Connected = 'connected';
    case Disconnected = 'disconnected';
    case Unknown = 'unknown';
}
