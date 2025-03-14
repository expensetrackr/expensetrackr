<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Models\Workspace;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspaceData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        #[MapName('personal_workspace')]
        public readonly bool $personalWorkspace,
    ) {}

    public static function fromModel(Workspace $workspace): self
    {
        return self::from([
            'id' => $workspace->id,
            'name' => $workspace->name,
            'personalWorkspace' => $workspace->personal_workspace,
        ]);
    }
}
