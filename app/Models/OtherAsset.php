<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Carbon\CarbonImmutable;
use Database\Factories\OtherAssetFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\OtherAssetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OtherAsset whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class OtherAsset extends Model
{
    /** @use HasFactory<OtherAssetFactory> */
    use Accountable, HasFactory;
}
