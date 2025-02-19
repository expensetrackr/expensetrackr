<?php

declare(strict_types=1);

namespace App\Enums\Polar;

enum CustomFieldType: string
{
    case TEXT = 'text';
    case NUMBER = 'number';
    case DATE = 'date';
    case CHECKBOX = 'checkbox';
    case SELECT = 'select';
}
