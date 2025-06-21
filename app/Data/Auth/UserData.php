<?php

declare(strict_types=1);

namespace App\Data\Auth;

use App\Models\User;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class UserData extends Data
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
            'twoFactorEnabled' => $user->two_factor_secret !== null,
            'isSubscribed' => $user->isSubscribed(),
        ]);
    }
}
