<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Models\Category;

final class DeleteCategory
{
    /**
     * Delete a category
     */
    public function handle(Category $category): void
    {
        $category->delete();
    }
}
