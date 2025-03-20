<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]

final class WorkspaceSettingsData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly bool $isDataEnrichmentEnabled,
    ) {}
}
