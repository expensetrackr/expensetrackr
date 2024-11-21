<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Carbon\CarbonImmutable;
use Database\Factories\OtherLiabilityFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\OtherLiabilityFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherLiability whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class OtherLiability extends Model
{
    /** @use HasFactory<OtherLiabilityFactory> */
    use Accountable, HasFactory;
}
