<?php

declare(strict_types=1);

namespace App\Models;

use Akaunting\Money\Casts\CurrencyCast;
use Akaunting\Money\Casts\MoneyCast;
use App\Concerns\Blamable;
use App\Concerns\WorkspaceOwned;
use Database\Factories\AccountFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Akaunting\Money\Currency $currency_code
 * @property \Akaunting\Money\Money $initial_balance
 * @property \Akaunting\Money\Money $current_balance
 * @property string $type
 * @property bool $is_default
 * @property string $public_id
 * @property int $workspace_id
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read User|null $createdBy
 * @property-read string|null $prefixed_id
 * @property-read User|null $updatedBy
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\AccountFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCurrencyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCurrentBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereInitialBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class Account extends Model
{
    /** @use HasFactory<AccountFactory> */
    use Blamable, HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'currency_code' => CurrencyCast::class,
            'initial_balance' => MoneyCast::class,
            'current_balance' => MoneyCast::class,
        ];
    }
}
