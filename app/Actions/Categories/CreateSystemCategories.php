<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Enums\Finance\CategoryClassification;
use App\Models\Category;
use App\Models\Workspace;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

final class CreateSystemCategories
{
    /**
     * Create or update (idempotently) system categories for the given workspace.
     */
    public function handle(Workspace $workspace): void
    {
        $categories = config('system_categories', []);

        $jsonPath = storage_path('app/system_categories.json');

        if (is_file($jsonPath)) {
            $contents = @file_get_contents($jsonPath);

            if ($contents === false) {
                Log::warning("CreateSystemCategories: Unable to read system_categories.json at $jsonPath");
            } else {
                $decoded = json_decode($contents, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::warning('CreateSystemCategories: Invalid JSON in '.$jsonPath.' – '.json_last_error_msg());
                } elseif (is_array($decoded)) {
                    $categories = $decoded;
                }
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
        $classification = $category['classification'] instanceof CategoryClassification
            ? $category['classification']
            : CategoryClassification::from($category['classification']);

        $slug = $category['slug'] ?? Str::of($category['name'])->slug()->toString();

        $parentId = null;
        if (isset($category['parent_slug'])) {
            $parent = Category::where('slug', $category['parent_slug'])
                ->where('workspace_id', $workspace->id)
                ->first();

            if ($parent === null) {
                throw new RuntimeException("CreateSystemCategories: parent_slug '{$category['parent_slug']}' not found for workspace ID {$workspace->id}");
            }

            $parentId = $parent->id;
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
