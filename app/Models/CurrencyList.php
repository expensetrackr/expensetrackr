<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class CurrencyList extends Model
{
    protected function casts(): array
    {
        return [
            'available' => 'boolean',
        ];
    }
}
