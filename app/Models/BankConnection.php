<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use App\Concerns\WorkspaceOwned;
use App\Enums\Banking\ConnectionStatus;
use App\Enums\Banking\ProviderType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string|null $institution_id
 * @property string $institution_name
 * @property string|null $institution_logo_url
 * @property string|null $provider_connection_id
 * @property ProviderType $provider_type
 * @property string $access_token
 * @property string|null $refresh_token
 * @property \Carbon\CarbonImmutable|null $token_expires_at
 * @property ConnectionStatus $status
 * @property \Carbon\CarbonImmutable|null $last_sync_at
 * @property string|null $error_message
 * @property array<array-key, mixed>|null $provider_metadata
 * @property int $workspace_id
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Account> $accounts
 * @property-read int|null $accounts_count
 * @property-read string|null $prefixed_id
 * @property-read Workspace $workspace
 *
 * @method static Builder<static>|BankConnection mx()
 * @method static Builder<static>|BankConnection newModelQuery()
 * @method static Builder<static>|BankConnection newQuery()
 * @method static Builder<static>|BankConnection query()
 * @method static Builder<static>|BankConnection teller()
 * @method static Builder<static>|BankConnection whereAccessToken($value)
 * @method static Builder<static>|BankConnection whereCreatedAt($value)
 * @method static Builder<static>|BankConnection whereErrorMessage($value)
 * @method static Builder<static>|BankConnection whereId($value)
 * @method static Builder<static>|BankConnection whereInstitutionId($value)
 * @method static Builder<static>|BankConnection whereInstitutionLogoUrl($value)
 * @method static Builder<static>|BankConnection whereInstitutionName($value)
 * @method static Builder<static>|BankConnection whereLastSyncAt($value)
 * @method static Builder<static>|BankConnection whereProviderConnectionId($value)
 * @method static Builder<static>|BankConnection whereProviderMetadata($value)
 * @method static Builder<static>|BankConnection whereProviderType($value)
 * @method static Builder<static>|BankConnection wherePublicId($value)
 * @method static Builder<static>|BankConnection whereRefreshToken($value)
 * @method static Builder<static>|BankConnection whereStatus($value)
 * @method static Builder<static>|BankConnection whereTokenExpiresAt($value)
 * @method static Builder<static>|BankConnection whereUpdatedAt($value)
 * @method static Builder<static>|BankConnection whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class BankConnection extends Model
{
    use HasPrefixedId, WorkspaceOwned;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var list<string>
     */
    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    /**
     * Get the accounts for the bank connection.
     *
     * @return HasMany<Account, covariant $this>
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    /**
     * Determine if the token is expired.
     */
    public function isTokenExpired(): bool
    {
        return $this->token_expires_at && $this->token_expires_at->isPast();
    }

    /**
     * Mark the bank connection as inactive.
     */
    public function markAsInactive(?string $errorMessage = null): void
    {
        $this->update([
            'is_active' => false,
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Mark the bank connection as synced.
     */
    public function markAsSynced(): void
    {
        $this->update([
            'last_sync_at' => now(),
            'is_active' => true,
            'error_message' => null,
        ]);
    }

    /**
     * Scope a query to only include Teller bank connections.
     *
     * @param  Builder<BankConnection>  $query
     * @return Builder<BankConnection>
     */
    #[Scope]
    protected function teller(Builder $query): Builder
    {
        return $query->whereProviderType(ProviderType::Teller);
    }

    /**
     * Scope a query to only include MX bank connections.
     *
     * @param  Builder<BankConnection>  $query
     * @return Builder<BankConnection>
     */
    #[Scope]
    protected function mx(Builder $query): Builder
    {
        return $query->whereProviderType(ProviderType::Mx);
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'provider_type' => ProviderType::class,
            'token_expires_at' => 'datetime',
            'status' => ConnectionStatus::class,
            'last_sync_at' => 'datetime',
            'provider_metadata' => 'json',
        ];
    }
}
