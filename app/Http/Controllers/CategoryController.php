<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Categories\CreateCategory;
use App\Actions\Categories\DeleteCategory;
use App\Actions\Categories\UpdateCategory;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class CategoryController
{
    /**
     * Display all categories.
     */
    public function index(Request $request)
    {
        $categories = Category::query()
            ->where(function ($query) use ($request): void {
                $query->where('is_system', true)
                    ->orWhere(function ($query) use ($request): void {
                        $query->where('workspace_id', $request->user()->current_workspace_id)
                            ->where('is_system', false);
                    });
            })
            ->with(['workspace', 'parent', 'children', 'children.workspace', 'children.parent'])
            ->orderBy('name', 'asc')
            ->get()
            ->groupBy('classification')
            ->map(fn ($group) => CategoryResource::collection($group));

        return Inertia::render('categories/page', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new category.
     */
    public function store(CreateCategoryRequest $request, CreateCategory $action)
    {
        $action->handle(type($request->user())->as(User::class), $request->validated());

        return back()->with('toast', [
            'title' => 'Category created',
            'type' => 'success',
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategory $action)
    {
        $action->handle($category, $request->validated());

        return back()->with('toast', [
            'title' => 'Category updated',
            'type' => 'success',
        ]);
    }

    /**
     * Delete the specified category.
     */
    public function destroy(Request $request, Category $category, DeleteCategory $action): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('delete', $category)) {
            return to_route('categories.index');
        }

        if ($category->is_system) {
            return back()->with('toast', [
                'title' => 'Cannot delete system category',
                'type' => 'error',
            ]);
        }

        if ($request->user()->cannot('delete', $category)) {
            return back()->with('toast', [
                'title' => 'Cannot delete category',
                'type' => 'error',
            ]);
        }

        $action->handle($category);

        return back()->with('toast', [
            'title' => 'Category deleted',
            'type' => 'success',
        ]);
    }
}
