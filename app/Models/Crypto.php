<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\CryptoFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Crypto whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class Crypto extends Model
{
    /** @use HasFactory<\Database\Factories\CryptoFactory> */
    use Accountable, HasFactory;
}
