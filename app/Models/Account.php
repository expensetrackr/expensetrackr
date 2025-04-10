<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Blamable;
use App\Concerns\Chartable;
use App\Concerns\WorkspaceOwned;
use App\Enums\AccountSubtype;
use App\Enums\AccountType;
use App\Models\Projections\AccountProjection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use InvalidArgumentException;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string $accountable_type
 * @property int $accountable_id
 * @property string $name
 * @property string|null $description
 * @property AccountSubtype|null $subtype
 * @property string $currency_code
 * @property string $initial_balance
 * @property string $current_balance
 * @property bool $is_default
 * @property string $public_id
 * @property int $workspace_id
 * @property string|null $external_id
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $bank_connection_id
 * @property-read Model $accountable
 * @property-read \Illuminate\Database\Eloquent\Collection<int, AccountBalance> $balances
 * @property-read int|null $balances_count
 * @property-read BankConnection|null $bankConnection
 * @property-read User|null $createdBy
 * @property-read string|null $prefixed_id
 * @property-read AccountType $type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $transactions
 * @property-read int|null $transactions_count
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereSubtype($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use Blamable, Chartable, HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'type',
    ];

    private array $projections = [
        AccountProjection::class,
    ];

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
     * Get the account type based on the accountable relationship.
     *
     * @return Attribute<AccountType, never>
     */
    protected function type(): Attribute
    {
        return Attribute::make(
            get: fn (): \App\Enums\AccountType => match ($this->accountable_type) {
                Depository::class => AccountType::Depository,
                Investment::class => AccountType::Investment,
                Crypto::class => AccountType::Crypto,
                OtherAsset::class => AccountType::OtherAsset,
                CreditCard::class => AccountType::CreditCard,
                Loan::class => AccountType::Loan,
                OtherLiability::class => AccountType::OtherLiability,
                default => throw new InvalidArgumentException("Unknown accountable type: {$this->accountable_type}"),
            },
        );
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtype' => AccountSubtype::class,
        ];
    }
}
