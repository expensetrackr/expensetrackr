<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Enums\Finance\CategoryClassification;
use App\Models\Category;
use App\Models\Workspace;
use Illuminate\Support\Str;

final class CreateSystemCategories
{
    /**
     * Create or update (idempotently) system categories for the given workspace.
     */
    public function handle(Workspace $workspace): void
    {
        // Primary source comes from config which is cacheable (perf-friendly).
        $categories = config('system_categories', []);

        // Optional override via JSON for custom deployments.
        $jsonPath = storage_path('app/system_categories.json');

        if (is_file($jsonPath)) {
            $json = json_decode((string) file_get_contents($jsonPath), true);

            if (is_array($json)) {
                $categories = $json;
            }
        }

        // First pass – create/update all parent categories (those without parent_slug)
        foreach ($categories as $category) {
            if (! isset($category['parent_slug'])) {
                $this->upsertCategory($workspace, $category);
            }
        }

        // Second pass – now that parents exist, handle children
        foreach ($categories as $category) {
            if (isset($category['parent_slug'])) {
                $this->upsertCategory($workspace, $category);
            }
        }
    }

    /**
     * Upsert a single category record.
     *
     * @param  array{name:string,slug?:string,color:string,description:string,classification:string|CategoryClassification,icon?:string,parent_slug?:string}  $category
     */
    private function upsertCategory(Workspace $workspace, array $category): void
    {
        // Resolve classification enum instance
        $classification = $category['classification'] instanceof CategoryClassification
            ? $category['classification']
            : CategoryClassification::from($category['classification']);

        // Determine slug – provided or derived from name
        $slug = $category['slug'] ?? Str::of($category['name'])->slug()->toString();

        // Resolve parent id if any
        $parentId = null;
        if (isset($category['parent_slug'])) {
            $parent = Category::where('slug', $category['parent_slug'])
                ->where('workspace_id', $workspace->id)
                ->first();

            $parentId = $parent?->id;
        }

        Category::updateOrCreate(
            [
                'slug' => $slug,
                'workspace_id' => $workspace->id,
            ],
            [
                'name' => __("categories.{$slug}.name"),
                'color' => $category['color'],
                'description' => __("categories.{$slug}.description"),
                'classification' => $classification,
                'is_system' => true,
                'icon' => $category['icon'] ?? null,
                'parent_id' => $parentId,
                'is_active' => true,
            ]
        );
    }
}
