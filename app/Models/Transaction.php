<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use App\Enums\Finance\TransactionRecurringInterval;
use App\Enums\Finance\TransactionStatus;
use App\Enums\Finance\TransactionType;
use App\Observers\TransactionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string $name
 * @property string|null $note
 * @property TransactionStatus $status
 * @property TransactionType $type
 * @property string|null $base_amount
 * @property string|null $base_currency
 * @property string|null $currency_rate
 * @property string $amount
 * @property string $currency
 * @property bool $is_recurring
 * @property TransactionRecurringInterval|null $recurring_interval
 * @property bool $is_manual
 * @property \Carbon\CarbonImmutable $dated_at
 * @property string|null $external_id
 * @property string $public_id
 * @property int $account_id
 * @property int $workspace_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property int|null $category_id
 * @property \Carbon\CarbonImmutable|null $enriched_at
 * @property int|null $merchant_id
 * @property int|null $recurring_parent_id
 * @property \Carbon\CarbonImmutable|null $recurring_start_at The date when this recurring transaction should start
 * @property-read Account $account
 * @property-read Category|null $category
 * @property-read string|null $prefixed_id
 * @property-read Collection<int, Transaction> $recurring_chain
 * @property-read Merchant|null $merchant
 * @property-read Collection<int, Transaction> $recurringChildren
 * @property-read int|null $recurring_children_count
 * @property-read Transaction|null $recurringParent
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereBaseAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereBaseCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCurrencyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereDatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereEnrichedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereIsManual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereIsRecurring($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereMerchantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereRecurringInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereRecurringParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereRecurringStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
#[ObservedBy(TransactionObserver::class)]
final class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasPrefixedId, Searchable, WorkspaceOwned;

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'public_id';
    }

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
     * The merchant that the transaction belongs to.
     *
     * @return BelongsTo<Merchant, covariant $this>
     */
    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    /**
     * Get the parent recurring transaction.
     *
     * @return BelongsTo<Transaction, covariant $this>
     */
    public function recurringParent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'recurring_parent_id');
    }

    /**
     * Get all transactions that were created from this recurring transaction.
     *
     * @return HasMany<Transaction, covariant $this>
     */
    public function recurringChildren(): HasMany
    {
        return $this->hasMany(self::class, 'recurring_parent_id');
    }

    /**
     * Get all transactions in the recurring chain, including parent and siblings.
     *
     * @return Collection<int, Transaction>
     */
    public function getRecurringChainAttribute(): Collection
    {
        if ($this->recurringParent) {
            return $this->recurringParent->recurringChildren;
        }

        return $this->recurringChildren;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'note' => $this->note,
            'type' => $this->type,
            'base_amount' => $this->base_amount,
            'base_currency' => $this->base_currency,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'account_id' => $this->account->public_id,
            'category_id' => $this->category?->public_id,
            'category_name' => $this->category?->name,
            'merchant_id' => $this->merchant?->public_id,
            'merchant_name' => $this->merchant?->name,
            'dated_at' => $this->dated_at,
            'enriched_at' => $this->enriched_at,
            'recurring_start_at' => $this->recurring_start_at,
        ];
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
            'recurring_interval' => TransactionRecurringInterval::class,
            'dated_at' => 'datetime',
            'enriched_at' => 'datetime',
            'recurring_start_at' => 'datetime',
        ];
    }
}
