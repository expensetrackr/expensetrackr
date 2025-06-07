<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;

final class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     *
     * @return ResourceCollection<Category>
     */
    public function index(Request $request): JsonResponse|ResourceCollection
    {
        if (! $request->user()?->currentWorkspace) {
            return response()->json(['message' => 'No workspace selected'], 400);
        }

        /** @var int */
        $perPage = request()->get('per_page', 10);

        return QueryBuilder::for(Category::class)
            ->allowedFilters(['name', 'classification'])
            ->allowedSorts(['created_at', '-created_at'])
            ->allowedIncludes(['parent'])
            ->defaultSort('-created_at')
            ->paginate($perPage)
            ->withQueryString()
            ->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): CategoryResource
    {
        return $category->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): void
    {
        //
    }
}
