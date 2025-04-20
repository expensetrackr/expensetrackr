<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
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
    public function index(): ResourceCollection
    {
        /** @var int */
        $perPage = request()->get('per_page', 10);

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
    public function show(Account $account): void
    {
        //
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
