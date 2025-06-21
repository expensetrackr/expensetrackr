<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Workspace;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // We must ensure each (workspace_id, slug) pair is unique before we add
        // the new unique index. Previously the uniqueness included `is_system`,
        // so duplicates are possible (e.g. custom + system categories with the
        // same slug).

        Workspace::query()->chunkById(100, function ($workspaces): void {
            foreach ($workspaces as $workspace) {
                // Find duplicate slugs within this workspace.
                $duplicates = Category::query()
                    ->select('slug')
                    ->where('workspace_id', $workspace->id)
                    ->groupBy('slug')
                    ->havingRaw('COUNT(*) > 1')
                    ->pluck('slug');

                foreach ($duplicates as $slug) {
                    // Prefer the system category as canonical, otherwise the first created.
                    $canonical = Category::query()
                        ->where('workspace_id', $workspace->id)
                        ->where('slug', $slug)
                        ->orderByDesc('is_system') // system first
                        ->oldest()
                        ->first();

                    // Re-point transactions on the non-canonical categories and delete them.
                    Category::where('workspace_id', $workspace->id)
                        ->where('slug', $slug)
                        ->where('id', '!=', $canonical->id)
                        ->each(function (Category $duplicate) use ($canonical): void {
                            // Move transactions.
                            $duplicate->transactions()->update(['category_id' => $canonical->id]);

                            // Finally delete the duplicate.
                            $duplicate->delete();
                        });
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse – data has been cleaned.
    }
};
