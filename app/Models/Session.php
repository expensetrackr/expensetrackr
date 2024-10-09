<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Session extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'payload',
        'last_activity',
    ];

    protected $casts = [
        'id' => 'string',
        'last_activity' => 'datetime',
    ];
}
