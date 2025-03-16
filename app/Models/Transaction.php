<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property string $id
 * @property string $name
 * @property string|null $note
 * @property TransactionStatus $status
 * @property TransactionType $type
 * @property int|null $base_amount
 * @property string|null $base_currency
 * @property string|null $currency_rate
 * @property int $amount
 * @property string $currency
 * @property bool $is_recurring
 * @property bool $is_manual
 * @property \Carbon\CarbonImmutable $dated_at
 * @property string|null $external_id
 * @property int $workspace_id
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 * @property-read string|null $prefixed_id
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereBaseAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereBaseCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCurrencyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereDatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereIsManual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereIsRecurring($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereWorkspaceId($value)
 *
 * @property int|null $category_id
 * @property-read Category|null $category
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCategoryId($value)
 *
 * @mixin \Eloquent
 */
final class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * The account that the transaction belongs to.
     *
     * @return BelongsTo<Account, covariant $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * The category that the transaction belongs to.
     *
     * @return BelongsTo<Category, covariant $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TransactionStatus::class,
            'type' => TransactionType::class,
            'dated_at' => 'datetime',
        ];
    }
}
