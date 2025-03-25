<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Models\Category;

final class UpdateCategory
{
    /**
     * Validate and update the given category.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(Category $category, array $input): void
    {
        $category->forceFill([
            'name' => $input['name'],
            'color' => $input['color'],
            'description' => $input['description'],
            'classification' => $input['classification'],
            'parent_id' => $input['parent_id'] ? Category::wherePublicId($input['parent_id'])->first()?->id : null,
        ])->save();
    }
}
