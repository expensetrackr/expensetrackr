<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\BankAccounts\CreateAccount;
use App\Actions\BankAccounts\DeleteAccount;
use App\Actions\BankAccounts\UpdateAccount;
use App\Http\Requests\API\StoreAccountRequest;
use App\Http\Requests\API\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

final class AccountController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return ResourceCollection<Account>|JsonResponse
     */
    public function index(Request $request): ResourceCollection|JsonResponse
    {
        try {
            /** @var int */
            $perPage = $request->get('per_page', 15);
            $perPage = min($perPage, 100); // Limit to 100 items per page for performance

            return QueryBuilder::for(Account::class)
                ->allowedFilters(['name', 'currency_code', 'is_default', 'is_manual'])
                ->allowedSorts(['name', '-name', 'created_at', '-created_at', 'current_balance', '-current_balance'])
                ->allowedIncludes(['bankConnection', 'accountable'])
                ->defaultSort('-created_at')
                ->paginate($perPage)
                ->withQueryString()
                ->toResourceCollection();
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request, CreateAccount $action): JsonResponse
    {
        try {
            $account = $action->create($request->validated(), isManual: true);

            return $this->successResponse(
                new AccountResource($account->load(['bankConnection', 'accountable'])),
                'Account created successfully',
                201
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account): JsonResponse
    {
        try {
            $this->authorize('view', $account);

            $account->load([
                'bankConnection',
                'accountable',
                'transactions' => function (Builder $query): void {
                    $query->latest('dated_at')
                        ->with('category')
                        ->limit(5);
                },
            ]);

            return $this->resourceResponse(new AccountResource($account));
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account, UpdateAccount $action): JsonResponse
    {
        try {
            $updatedAccount = $action->handle($account, $request->validated());

            return $this->successResponse(
                new AccountResource($updatedAccount->load(['bankConnection', 'accountable'])),
                'Account updated successfully'
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account, DeleteAccount $action): JsonResponse
    {
        try {
            $this->authorize('delete', $account);

            $action->handle($account);

            return response()->json(null, 204);
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }
}
