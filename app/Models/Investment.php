<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Carbon\CarbonImmutable;
use Database\Factories\InvestmentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\InvestmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Investment whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class Investment extends Model
{
    /** @use HasFactory<InvestmentFactory> */
    use Accountable, HasFactory;
}
