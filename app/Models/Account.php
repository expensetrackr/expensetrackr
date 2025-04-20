<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Blamable;
use App\Concerns\WorkspaceOwned;
use App\Enums\Finance\AccountSubtype;
use App\Enums\Finance\AccountType;
use App\Observers\AccountObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use InvalidArgumentException;
use Laravel\Scout\Searchable;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string $accountable_type
 * @property int $accountable_id
 * @property string $name
 * @property string|null $description
 * @property AccountSubtype|null $subtype
 * @property string $currency_code
 * @property numeric $initial_balance
 * @property numeric $current_balance
 * @property bool $is_default
 * @property bool $is_manual
 * @property string $public_id
 * @property int $workspace_id
 * @property string|null $external_id
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property int|null $bank_connection_id
 * @property-read Model $accountable
 * @property-read \Illuminate\Database\Eloquent\Collection<int, AccountBalance> $balances
 * @property-read int|null $balances_count
 * @property-read BankConnection|null $bankConnection
 * @property-read User|null $createdBy
 * @property-read string|null $prefixed_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $transactions
 * @property-read int|null $transactions_count
 * @property-read AccountType $type
 * @property-read User|null $updatedBy
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\AccountFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereAccountableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereAccountableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereBankConnectionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCurrencyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCurrentBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereExternalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereInitialBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereIsManual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereSubtype($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
#[ObservedBy(AccountObserver::class)]
final class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use Blamable, HasFactory, HasPrefixedId, Searchable, WorkspaceOwned;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'type',
    ];

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
     * The accountable model.
     *
     * @return MorphTo<Model, covariant $this>
     */
    public function accountable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The bank connection that the account belongs to.
     *
     * @return BelongsTo<BankConnection, covariant $this>
     */
    public function bankConnection(): BelongsTo
    {
        return $this->belongsTo(BankConnection::class);
    }

    /**
     * The transactions that the account has.
     *
     * @return HasMany<Transaction, covariant $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * The account balances that the account has.
     *
     * @return HasMany<AccountBalance, covariant $this>
     */
    public function balances(): HasMany
    {
        return $this->hasMany(AccountBalance::class);
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'currency_code' => $this->currency_code,
            'initial_balance' => $this->initial_balance,
            'current_balance' => $this->current_balance,
            'is_default' => $this->is_default,
            'is_manual' => $this->is_manual,
            'external_id' => $this->external_id,
            'bank_connection_id' => $this->bankConnection?->public_id,
            'workspace_id' => $this->workspace->public_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get the account type based on the accountable relationship.
     */
    public function getTypeAttribute(): AccountType
    {
        return match ($this->accountable_type) {
            Depository::class => AccountType::Depository,
            Investment::class => AccountType::Investment,
            Crypto::class => AccountType::Crypto,
            OtherAsset::class => AccountType::OtherAsset,
            CreditCard::class => AccountType::CreditCard,
            Loan::class => AccountType::Loan,
            OtherLiability::class => AccountType::OtherLiability,
            default => throw new InvalidArgumentException("Unknown accountable type: {$this->accountable_type}"),
        };
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'current_balance' => 'decimal:4',
            'initial_balance' => 'decimal:4',
            'subtype' => AccountSubtype::class,
        ];
    }
}
