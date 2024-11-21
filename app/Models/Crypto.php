<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Carbon\CarbonImmutable;
use Database\Factories\CryptoFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
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
 * @mixin Eloquent
 */
final class Crypto extends Model
{
    /** @use HasFactory<CryptoFactory> */
    use Accountable, HasFactory;
}
