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
use Spatie\QueryBuilder\AllowedFilter;
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
            
            $workspaceId = auth()->user()->current_workspace_id;
            
            // Create cache key based on request parameters
            $cacheKey = $this->generateCacheKey($request, $workspaceId);
            
            // Try to get from cache first
            $cachedResult = $this->cacheService->getCachedQuery($cacheKey);
            if ($cachedResult) {
                return $cachedResult;
            }
            
            // Use QueryBuilder for flexible, efficient queries
            $accounts = QueryBuilder::for(Account::class)
                ->where('workspace_id', $workspaceId)
                ->allowedFilters([
                    AllowedFilter::partial('name'),
                    AllowedFilter::exact('currency_code'),
                    AllowedFilter::exact('is_default'),
                    AllowedFilter::exact('is_manual'),
                    AllowedFilter::callback('type', function ($query, $value) {
                        $modelClass = $this->getModelClassFromType($value);
                        $query->where('accountable_type', $modelClass);
                    }),
                    AllowedFilter::callback('balance_min', function ($query, $value) {
                        $query->where('current_balance', '>=', $value);
                    }),
                    AllowedFilter::callback('balance_max', function ($query, $value) {
                        $query->where('current_balance', '<=', $value);
                    }),
                    AllowedFilter::callback('created_from', function ($query, $value) {
                        $query->where('created_at', '>=', $value);
                    }),
                    AllowedFilter::callback('created_to', function ($query, $value) {
                        $query->where('created_at', '<=', $value);
                    }),
                    AllowedFilter::callback('search', function ($query, $value) {
                        $query->where('name', 'like', '%' . $value . '%');
                    }),
                ])
                ->allowedSorts([
                    'name', 
                    '-name', 
                    'created_at', 
                    '-created_at', 
                    'current_balance', 
                    '-current_balance',
                    'currency_code',
                    '-currency_code',
                    'is_default',
                    '-is_default'
                ])
                ->allowedIncludes(['bankConnection', 'accountable'])
                ->defaultSort('-created_at')
                ->paginate($perPage)
                ->withQueryString();
            
            $result = AccountResource::collection($accounts)->additional([
                'success' => true,
                'message' => 'Accounts retrieved successfully.',
            ]);
            
            // Cache the result
            $this->cacheService->cacheQuery($cacheKey, $result);
            
            return $result;
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
            
            $cacheKey = 'accounts:stats:' . $workspaceId;
            $stats = $this->cacheService->getCachedQuery($cacheKey);
            
            if (!$stats) {
                $accounts = QueryBuilder::for(Account::class)
                    ->where('workspace_id', $workspaceId)
                    ->get();
                
                $stats = [
                    'total_accounts' => $accounts->count(),
                    'total_balance' => $accounts->sum('current_balance'),
                    'by_type' => $accounts->groupBy('accountable_type')->map->count(),
                    'by_currency' => $accounts->groupBy('currency_code')->map->count(),
                    'default_account' => $accounts->where('is_default', true)->first()?->public_id,
                    'average_balance' => $accounts->avg('current_balance'),
                    'manual_accounts' => $accounts->where('is_manual', true)->count(),
                    'automated_accounts' => $accounts->where('is_manual', false)->count(),
                ];
                
                $this->cacheService->cacheQuery($cacheKey, $stats);
            }
            
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
            $modelClass = $this->getModelClassFromType($type);
            
            $accounts = QueryBuilder::for(Account::class)
                ->where('workspace_id', $workspaceId)
                ->where('accountable_type', $modelClass)
                ->allowedIncludes(['bankConnection', 'accountable'])
                ->allowedSorts(['name', '-name', 'created_at', '-created_at', 'current_balance', '-current_balance'])
                ->defaultSort('name')
                ->get();
            
            return $this->successResponse(
                AccountResource::collection($accounts),
                "Accounts of type '{$type}' retrieved successfully."
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Generate cache key for request.
     */
    private function generateCacheKey(Request $request, int $workspaceId): string
    {
        $params = $request->query();
        ksort($params);
        return 'accounts:query:' . $workspaceId . ':' . md5(serialize($params));
    }

    /**
     * Get model class from account type.
     */
    private function getModelClassFromType(string $type): string
    {
        return match ($type) {
            'depository' => 'App\\Models\\Depository',
            'credit_card' => 'App\\Models\\CreditCard',
            'loan' => 'App\\Models\\Loan',
            'investment' => 'App\\Models\\Investment',
            'crypto' => 'App\\Models\\Crypto',
            'other_asset' => 'App\\Models\\OtherAsset',
            'other_liability' => 'App\\Models\\OtherLiability',
            default => 'App\\Models\\Depository',
        };
    }
}
