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
use App\Services\AccountCacheService;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

final class AccountController extends BaseApiController
{
    /**
     * The account cache service.
     */
    private AccountCacheService $cacheService;

    /**
     * Create a new controller instance.
     */
    public function __construct(AccountCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

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
            
            $page = $request->get('page', 1);
            $workspaceId = auth()->user()->current_workspace_id;
            
            // Build filters array
            $filters = [];
            if ($request->has('search')) {
                $filters['search'] = $request->get('search');
            }
            if ($request->has('type')) {
                $filters['type'] = $request->get('type');
            }
            if ($request->has('currency')) {
                $filters['currency'] = $request->get('currency');
            }
            if ($request->has('is_default')) {
                $filters['is_default'] = $request->boolean('is_default');
            }
            if ($request->has('balance_min')) {
                $filters['balance_min'] = $request->get('balance_min');
            }
            if ($request->has('balance_max')) {
                $filters['balance_max'] = $request->get('balance_max');
            }
            if ($request->has('created_from')) {
                $filters['created_from'] = $request->get('created_from');
            }
            if ($request->has('created_to')) {
                $filters['created_to'] = $request->get('created_to');
            }

            // Use caching service
            $result = $this->cacheService->getAccountsList($workspaceId, $filters, $page, $perPage);
            
            return AccountResource::collection($result['data'])->additional([
                'meta' => $result['meta'],
                'success' => true,
                'message' => 'Accounts retrieved successfully.',
            ]);
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

            // Invalidate cache for the workspace
            $this->cacheService->invalidateWorkspaceCache($account->workspace_id);

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

            $workspaceId = auth()->user()->current_workspace_id;
            
            // Use caching service to get the account
            $cachedAccount = $this->cacheService->getAccount($account->public_id, $workspaceId);
            
            if (!$cachedAccount) {
                return $this->errorResponse('Account not found.', 404);
            }

            return $this->resourceResponse(new AccountResource($cachedAccount));
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

            // Invalidate cache for the account
            $this->cacheService->invalidateAccount($updatedAccount);

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

            // Invalidate cache before deletion
            $this->cacheService->invalidateAccount($account);

            $action->handle($account);

            return $this->successResponse(null, 'Account deleted successfully.');
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get account statistics for the workspace.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $workspaceId = auth()->user()->current_workspace_id;
            
            $stats = $this->cacheService->getAccountStats($workspaceId);
            
            return $this->successResponse($stats, 'Account statistics retrieved successfully.');
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get accounts by type.
     */
    public function byType(Request $request, string $type): JsonResponse
    {
        try {
            $workspaceId = auth()->user()->current_workspace_id;
            
            $accounts = $this->cacheService->getAccountsByType($workspaceId, $type);
            
            return $this->successResponse(
                AccountResource::collection($accounts),
                "Accounts of type '{$type}' retrieved successfully."
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }
}
