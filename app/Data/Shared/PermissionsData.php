<?php

declare(strict_types=1);

namespace App\Data\Shared;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class PermissionsData extends Data
{
    public function __construct(
        public readonly bool $canCreateAccounts,
        public readonly bool $canCreateCategories,
        public readonly bool $canCreateTransactions,
    ) {}
}
