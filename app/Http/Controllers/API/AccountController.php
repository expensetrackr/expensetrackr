<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\BankAccounts\CreateAccount;
use App\Actions\BankAccounts\DeleteAccount;
use App\Actions\BankAccounts\UpdateAccount;
use App\Enums\Finance\AccountType;
use App\Http\Requests\API\StoreAccountRequest;
use App\Http\Requests\API\UpdateAccountRequest;
use App\Models\Account;
use App\Services\AccountCacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\QueryParam;
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
     * @return ResourceCollection<Account>|JsonResponse
     */
    #[QueryParam(name: 'per_page', type: 'integer', description: 'The number of items per page', example: 15, required: false)]
    #[QueryParam(name: 'page', type: 'integer', description: 'The page number', example: 1, required: false)]
    #[QueryParam(name: 'sort', type: 'string', description: 'The field to sort by', example: 'name', required: false, enum: ['name', '-name', 'created_at', '-created_at', 'current_balance', '-current_balance', 'currency_code', '-currency_code', 'is_default', '-is_default'])]
    #[QueryParam(name: 'include', type: 'string', description: 'The relationships to include', example: 'bankConnection,accountable', required: false, enum: ['bankConnection', 'accountable'])]
    #[QueryParam(name: 'filter[q]', type: 'string', description: 'The search query to filter accounts by name', example: 'My Account', required: false)]
    #[QueryParam(name: 'filter[name]', type: 'string', description: 'The name of the account', example: 'My Account', required: false)]
    #[QueryParam(name: 'filter[currency_code]', type: 'string', description: 'The currency code of the account', example: 'USD', required: false)]
    #[QueryParam(name: 'filter[is_default]', type: 'boolean', description: 'Whether the account is the default account', example: true, required: false)]
    #[QueryParam(name: 'filter[is_manual]', type: 'boolean', description: 'Whether the account is manual', example: true, required: false)]
    #[QueryParam(name: 'filter[type]', type: 'string', description: 'The type of the account', example: 'depository', required: false, enum: AccountType::class)]
    #[QueryParam(name: 'filter[balance_min]', type: 'number', description: 'The minimum balance of the account', example: 100, required: false)]
    #[QueryParam(name: 'filter[balance_max]', type: 'number', description: 'The maximum balance of the account', example: 1000, required: false)]
    #[QueryParam(name: 'filter[created_from]', type: 'date', description: 'The minimum creation date of the account', example: '2021-01-01', required: false)]
    #[QueryParam(name: 'filter[created_to]', type: 'date', description: 'The maximum creation date of the account', example: '2021-01-01', required: false)]
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
            $accounts = $this->buildAccountQuery($workspaceId)
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
    public function store(StoreAccountRequest $request, CreateAccount $action): JsonResponse
    {
        try {
            $account = $action->create($request->validated(), isManual: true);

            $this->cacheService->invalidateWorkspaceCache($account->workspace_id);

            return $this->successResponse(
                $account->load(['bankConnection', 'accountable'])->toResource(),
                'Account created successfully',
                201
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Retrieve an account
     *
     * Retrieve an account by its public ID for the authenticated user in the current workspace.
     */
    public function show(Account $account): JsonResponse
    {
        try {
            $this->authorize('view', $account);

            $workspaceId = auth()->user()->current_workspace_id;

            $cachedAccount = $this->cacheService->getAccount($account->public_id, $workspaceId);

            if (! $cachedAccount) {
                return $this->errorResponse('Account not found.', 404);
            }

            return $this->resourceResponse($cachedAccount->toResource());
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update an account
     *
     * Update an account for the authenticated user in the current workspace.
     */
    public function update(UpdateAccountRequest $request, Account $account, UpdateAccount $action): JsonResponse
    {
        try {
            $updatedAccount = $action->handle($account, $request->validated());

            $this->cacheService->invalidateAccount($updatedAccount);

            return $this->successResponse(
                $updatedAccount->load(['bankConnection', 'accountable'])->toResource(),
                'Account updated successfully'
            );
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete an account
     *
     * Delete an account for the authenticated user in the current workspace.
     */
    public function destroy(Account $account, DeleteAccount $action): JsonResponse
    {
        try {
            $this->authorize('delete', $account);

            $this->cacheService->invalidateAccount($account);

            $action->handle($account);

            return $this->successResponse(null, 'Account deleted successfully.');
        } catch (Throwable $e) {
            return $this->handleException($e);
        }
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
     * Build the base query for accounts with filters and sorting.
     */
    private function buildAccountQuery(int $workspaceId): QueryBuilder
    {
        return QueryBuilder::for(Account::class)
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
            ->defaultSort('-created_at');
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
