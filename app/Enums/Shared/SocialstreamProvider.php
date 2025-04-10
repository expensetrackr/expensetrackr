<?php

declare(strict_types=1);

namespace App\Enums\Shared;

use Kongulov\Traits\InteractWithEnum;

enum SocialstreamProvider: string
{
    use InteractWithEnum;

    case Google = 'google';
}
