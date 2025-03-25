<?php

declare(strict_types=1);

namespace App\Actions\Categories;

use App\Models\Category;
use App\Models\User;

final class CreateCategory
{
    /**
     * Create a new category.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(User $user, array $input): Category
    {
        return Category::create([
            ...$input,
            'workspace_id' => $user->current_workspace_id,
        ]);
    }
}
