<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Enums\Finance\CategoryClassification;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\QueryParam;
use Spatie\QueryBuilder\QueryBuilder;

#[Group(name: 'Categories')]
final class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * List all categories
     *
     * Retrieve a list of categories for the authenticated user in the current workspace.
     *
     * Categories can be filtered by name and classification.
     * Results can be sorted by creation date.
     *
     * @return ResourceCollection<Category>
     */
    #[QueryParam(name: 'per_page', type: 'integer', description: 'The number of items per page', example: 15, required: false)]
    #[QueryParam(name: 'page', type: 'integer', description: 'The page number', example: 1, required: false)]
    #[QueryParam(name: 'sort', type: 'string', description: 'The field to sort by', example: 'name', required: false, enum: ['name', '-name', 'created_at', '-created_at'])]
    #[QueryParam(name: 'include', type: 'string', description: 'The relationships to include', example: 'parent', required: false, enum: ['parent'])]
    #[QueryParam(name: 'filter[name]', type: 'string', description: 'The name of the category', example: 'Food', required: false)]
    #[QueryParam(name: 'filter[classification]', type: 'string', description: 'The classification of the category', example: 'expense', required: false, enum: CategoryClassification::class)]
    public function index(): JsonResponse|ResourceCollection
    {
        /** @var int */
        $perPage = request()->get('per_page', 10);

        return QueryBuilder::for(Category::class)
            ->allowedFilters(['name', 'classification'])
            ->allowedSorts(['name', '-name', 'created_at', '-created_at'])
            ->allowedIncludes(['parent'])
            ->defaultSort('-created_at')
            ->fastPaginate($perPage)
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
     * Retrieve a category
     *
     * Retrieve a category by its public ID for the authenticated user in the current workspace.
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
