<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;

final class AccountController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     *
     * @return ResourceCollection<Account>
     */
    public function index(Request $request): ResourceCollection|JsonResponse
    {
        $this->authorize('viewAny', Account::class);

        /** @var int */
        $perPage = $request->get('per_page', 10);

        return QueryBuilder::for(Account::class)
            ->allowedFilters(['name'])
            ->allowedSorts(['name', '-name', 'created_at', '-created_at'])
            ->allowedIncludes(['bankConnection'])
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
    public function show(Account $account): AccountResource
    {
        $this->authorize('view', $account);

        return $account->load(['bankConnection', 'transactions' => function (Builder $query): void {
            $query
                ->latest('dated_at')
                ->with('category')
                ->limit(3);
        }])->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account): void
    {
        //
    }
}
