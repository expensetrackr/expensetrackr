<?php

declare(strict_types=1);

use App\Actions\Categories\CreateSystemCategories;
use App\Models\Workspace;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up(): void
    {
        // Ensure every workspace has the latest system categories (colors, icons, etc.).
        Workspace::query()->chunkById(100, function ($workspaces): void {
            /** @var CreateSystemCategories $action */
            $action = app(CreateSystemCategories::class);

            foreach ($workspaces as $workspace) {
                try {
                    $action->handle($workspace);
                } catch (Exception $e) {
                    Log::error("SyncSystemCategories: Error syncing categories for workspace {$workspace->id}", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }
        });
    }

    public function down(): void
    {
        // No-op. Upserts are idempotent; nothing to roll back.
    }
};
