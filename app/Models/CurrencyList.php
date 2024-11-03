<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property bool $available
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CurrencyList whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class CurrencyList extends Model
{
    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'available' => 'boolean',
        ];
    }
}
