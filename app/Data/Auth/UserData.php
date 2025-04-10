<?php

declare(strict_types=1);

namespace App\Data\Auth;

use App\Models\User;
use Laravel\Fortify\Features;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/** @final */
#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $profilePhotoPath,
        public readonly ?string $profilePhotoUrl,
        public readonly bool $twoFactorEnabled,
        public readonly ?bool $isSubscribed,
    ) {}

    final public static function fromModel(User $user): self
    {
        return self::from([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profilePhotoPath' => $user->profile_photo_path,
            'profilePhotoUrl' => $user->profile_photo_url,
            'twoFactorEnabled' => Features::enabled(Features::twoFactorAuthentication())
                && $user->two_factor_secret !== null,
            'isSubscribed' => $user->subscribed(),
        ]);
    }
}
