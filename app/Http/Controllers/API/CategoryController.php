<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

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
     * @return LengthAwarePaginator<CategoryResource>
     */
    public function index(): ResourceCollection
    {
        /** @var int */
        $perPage = request()->get('per_page', 10);

        return QueryBuilder::for(Category::class)
            ->allowedFilters([
                /**
                 * Filter categories by name (partial match).
                 *
                 * @example "Food"
                 */
                'name',
                /**
                 * Filter categories by classification type (expense, income, etc.).
                 *
                 * @example "expense"
                 */
                'classification',
            ])
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
