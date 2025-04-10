<?php

declare(strict_types=1);

namespace App\Enums\Shared;

enum ToastType: string
{
    case Error = 'error';
    case Warning = 'warning';
    case Success = 'success';
    case Info = 'info';
}
