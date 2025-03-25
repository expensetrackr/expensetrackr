<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class CategoryController
{
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
            ->with('workspace')
            ->orderBy('name', 'asc')
            ->get()
            ->groupBy('classification')
            ->map(fn ($group) => CategoryResource::collection($group));

        return Inertia::render('categories/page', [
            'categories' => $categories,
            'permissions' => [
                'canCreateCategories' => $request->user()->can('create', Category::class),
            ],
        ]);
    }
}
