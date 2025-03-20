<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Data\Auth\UserData;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceMemberData extends UserData
{
    public function __construct(
        public readonly WorkspaceMembershipData $membership,
    ) {}
}
