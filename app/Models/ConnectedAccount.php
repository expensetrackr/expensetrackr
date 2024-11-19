<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ConnectedAccountFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use JoelButcher\Socialstream\ConnectedAccount as SocialstreamConnectedAccount;
use JoelButcher\Socialstream\Events\ConnectedAccountCreated;
use JoelButcher\Socialstream\Events\ConnectedAccountDeleted;
use JoelButcher\Socialstream\Events\ConnectedAccountUpdated;

/**
 * @property int $id
 * @property int $user_id
 * @property string $provider
 * @property string $provider_id
 * @property string|null $name
 * @property string|null $nickname
 * @property string|null $email
 * @property string|null $telephone
 * @property string|null $avatar_path
 * @property string $token
 * @property string|null $secret
 * @property string|null $refresh_token
 * @property CarbonImmutable|null $expires_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User|null $user
 *
 * @method static \Database\Factories\ConnectedAccountFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereAvatarPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereNickname($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ConnectedAccount whereUserId($value)
 *
 * @mixin Eloquent
 */
final class ConnectedAccount extends SocialstreamConnectedAccount
{
    /** @use HasFactory<ConnectedAccountFactory> */
    use HasFactory, HasTimestamps;

    /**
     * The event map for the model.
     *
     * @var array<string, string>
     */
    protected $dispatchesEvents = [
        'created' => ConnectedAccountCreated::class,
        'updated' => ConnectedAccountUpdated::class,
        'deleted' => ConnectedAccountDeleted::class,
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }
}
