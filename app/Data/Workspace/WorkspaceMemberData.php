<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceMemberData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $profilePhotoPath,
        public readonly ?string $profilePhotoUrl,
        public readonly bool $twoFactorEnabled,
        public readonly ?bool $isSubscribed,
        public readonly WorkspaceMembershipData $membership,
    ) {}
}
