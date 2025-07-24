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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Knuckles\Scribe\Attributes\Group;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

#[Group(name: 'Accounts')]
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
     * List all accounts
     *
     * Retrieve a list of accounts for the authenticated user in the current workspace.
     *
     * @return LengthAwarePaginator<AccountResource>
     */
    public function index(Request $request): ResourceCollection|JsonResponse
    {
        try {
            /** @var int */
            $perPage = $request->get('per_page', 15);
            $perPage = min($perPage, 100); // Limit to 100 items per page for performance

            $workspaceId = auth()->user()->current_workspace_id;

            $cacheKey = $this->generateCacheKey($request, $workspaceId);

            $cachedResult = $this->cacheService->getCachedQuery($cacheKey);
            if ($cachedResult) {
                return $cachedResult;
            }

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
                    AllowedFilter::callback('q', function ($query, $value) {
                        $query->where('name', 'like', "%$value%");
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
                    '-is_default',
                ])
                ->allowedIncludes(['bankConnection', 'accountable'])
                ->defaultSort('-created_at')
                ->paginate($perPage)
                ->withQueryString()
                ->toResourceCollection();

            $this->cacheService->cacheQuery($cacheKey, $accounts);

            return $accounts;
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Create a new account
     *
     * Create a new account for the authenticated user in the current workspace.
     */
    public function store(StoreAccountRequest $request, CreateAccount $action): AccountResource
    {
        $account = $action->create($request->validated(), isManual: true);

        $this->cacheService->invalidateWorkspaceCache($account->workspace_id);

        return $account->load(['bankConnection', 'accountable'])->toResource();
    }

    /**
     * Retrieve an account
     *
     * Retrieve an account by its public ID for the authenticated user in the current workspace.
     */
    public function show(Account $account): AccountResource
    {
        $this->authorize('view', $account);

        $workspaceId = auth()->user()->current_workspace_id;

        $cachedAccount = $this->cacheService->getAccount($account->public_id, $workspaceId);

        if (! $cachedAccount) {
            abort(404, 'Account not found.');
        }

        return $cachedAccount->toResource();
    }

    /**
     * Update an account
     *
     * Update an account for the authenticated user in the current workspace.
     */
    public function update(UpdateAccountRequest $request, Account $account, UpdateAccount $action): AccountResource
    {
        $updatedAccount = $action->handle($account, $request->validated());

        $this->cacheService->invalidateAccount($updatedAccount);

        return $updatedAccount->load(['bankConnection', 'accountable'])->toResource();
    }

    /**
     * Delete an account
     *
     * Delete an account for the authenticated user in the current workspace.
     */
    public function destroy(Account $account, DeleteAccount $action): Response
    {
        $this->authorize('delete', $account);

        $this->cacheService->invalidateAccount($account);

        $action->handle($account);

        return response()->noContent();
    }

    /**
     * Get account statistics
     *
     * Retrieve statistics for all accounts in the current workspace.
     */
    public function stats(): JsonResponse
    {
        try {
            $workspaceId = auth()->user()->current_workspace_id;

            $cacheKey = "accounts:stats:$workspaceId";
            $stats = $this->cacheService->getCachedQuery($cacheKey);

            if (! $stats) {
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
     * Generate cache key for request.
     */
    private function generateCacheKey(Request $request, int $workspaceId): string
    {
        $params = $request->query();
        ksort($params);

        return 'accounts:query:'.$workspaceId.':'.md5(serialize($params));
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
