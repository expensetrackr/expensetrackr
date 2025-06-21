<?php

declare(strict_types=1);

use App\Actions\Categories\CreateSystemCategories;
use App\Models\Workspace;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Ensure every workspace has the latest system categories (colors, icons, etc.).
        Workspace::query()->chunkById(100, function ($workspaces): void {
            /** @var CreateSystemCategories $action */
            $action = app(CreateSystemCategories::class);

            foreach ($workspaces as $workspace) {
                $action->handle($workspace);
            }
        });
    }

    public function down(): void
    {
        // No-op. Upserts are idempotent; nothing to roll back.
    }
};
