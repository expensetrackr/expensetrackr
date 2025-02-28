<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\User;
use Laravel\Fortify\Features;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $profile_photo_path,
        public readonly ?string $profile_photo_url,
        public readonly bool $two_factor_enabled,
    ) {}

    public static function fromModel(User $user): self
    {
        return self::from([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile_photo_path' => $user->profile_photo_path,
            'profile_photo_url' => $user->getAttributeValue('profile_photo_path'),
            'two_factor_enabled' => Features::enabled(Features::twoFactorAuthentication())
                && $user->two_factor_secret !== null,
        ]);
    }
}
