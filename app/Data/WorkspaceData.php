<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Workspace;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly bool $personal_workspace,
    ) {}

    public static function fromModel(Workspace $workspace): self
    {
        return self::from([
            'id' => $workspace->id,
            'name' => $workspace->name,
            'personal_workspace' => $workspace->personal_workspace,
        ]);
    }
}
