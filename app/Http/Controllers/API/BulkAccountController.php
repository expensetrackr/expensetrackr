<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Actions\BankAccounts\CreateAccount;
use App\Actions\BankAccounts\DeleteAccount;
use App\Actions\BankAccounts\UpdateAccount;
use App\Http\Requests\API\BulkAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Services\AccountCacheService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

final class BulkAccountController extends BaseApiController
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
     * Bulk create accounts.
     */
    public function bulkCreate(BulkAccountRequest $request, CreateAccount $action): JsonResponse
    {
        try {
            $accounts = [];
            $errors = [];
            $workspaceId = auth()->user()->current_workspace_id;

            DB::transaction(function () use ($request, $action, &$accounts, &$errors, $workspaceId) {
                foreach ($request->validated()['accounts'] as $index => $accountData) {
                    try {
                        $account = $action->create($accountData, isManual: true);
                        $accounts[] = $account;
                    } catch (Throwable $e) {
                        $errors[] = [
                            'index' => $index,
                            'data' => $accountData,
                            'error' => $e->getMessage(),
                        ];
                    }
                }

                // If any errors occurred, rollback the transaction
                if (!empty($errors)) {
                    throw new \Exception('Some accounts failed to create');
                }
            });

            // Invalidate cache for the workspace
            $this->cacheService->invalidateWorkspaceCache($workspaceId);

            return $this->successResponse([
                'accounts' => AccountResource::collection($accounts),
                'created_count' => count($accounts),
                'errors' => $errors,
            ], 'Bulk account creation completed successfully.', 201);

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Bulk update accounts.
     */
    public function bulkUpdate(BulkAccountRequest $request, UpdateAccount $action): JsonResponse
    {
        try {
            $updatedAccounts = [];
            $errors = [];
            $workspaceId = auth()->user()->current_workspace_id;

            DB::transaction(function () use ($request, $action, &$updatedAccounts, &$errors, $workspaceId) {
                foreach ($request->validated()['accounts'] as $index => $accountUpdate) {
                    try {
                        $account = QueryBuilder::for(Account::class)
                            ->where('public_id', $accountUpdate['id'])
                            ->where('workspace_id', $workspaceId)
                            ->first();

                        if (!$account) {
                            $errors[] = [
                                'index' => $index,
                                'id' => $accountUpdate['id'],
                                'error' => 'Account not found',
                            ];
                            continue;
                        }

                        $this->authorize('update', $account);

                        $updatedAccount = $action->handle($account, $accountUpdate);
                        $updatedAccounts[] = $updatedAccount;
                    } catch (Throwable $e) {
                        $errors[] = [
                            'index' => $index,
                            'id' => $accountUpdate['id'] ?? null,
                            'error' => $e->getMessage(),
                        ];
                    }
                }

                // If any critical errors occurred, rollback the transaction
                if (count($errors) > count($request->validated()['accounts']) / 2) {
                    throw new \Exception('Too many failures in bulk update');
                }
            });

            // Invalidate cache for the workspace
            $this->cacheService->invalidateWorkspaceCache($workspaceId);

            return $this->successResponse([
                'accounts' => AccountResource::collection($updatedAccounts),
                'updated_count' => count($updatedAccounts),
                'errors' => $errors,
            ], 'Bulk account update completed.');

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Bulk delete accounts.
     */
    public function bulkDelete(BulkAccountRequest $request, DeleteAccount $action): JsonResponse
    {
        try {
            $deletedAccounts = [];
            $errors = [];
            $workspaceId = auth()->user()->current_workspace_id;

            DB::transaction(function () use ($request, $action, &$deletedAccounts, &$errors, $workspaceId) {
                foreach ($request->validated()['account_ids'] as $index => $accountId) {
                    try {
                        $account = QueryBuilder::for(Account::class)
                            ->where('public_id', $accountId)
                            ->where('workspace_id', $workspaceId)
                            ->first();

                        if (!$account) {
                            $errors[] = [
                                'index' => $index,
                                'id' => $accountId,
                                'error' => 'Account not found',
                            ];
                            continue;
                        }

                        $this->authorize('delete', $account);

                        $action->handle($account);
                        $deletedAccounts[] = $accountId;
                    } catch (Throwable $e) {
                        $errors[] = [
                            'index' => $index,
                            'id' => $accountId,
                            'error' => $e->getMessage(),
                        ];
                    }
                }

                // If any critical errors occurred, rollback the transaction
                if (count($errors) > count($request->validated()['account_ids']) / 2) {
                    throw new \Exception('Too many failures in bulk delete');
                }
            });

            // Invalidate cache for the workspace
            $this->cacheService->invalidateWorkspaceCache($workspaceId);

            return $this->successResponse([
                'deleted_accounts' => $deletedAccounts,
                'deleted_count' => count($deletedAccounts),
                'errors' => $errors,
            ], 'Bulk account deletion completed.');

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Bulk export accounts.
     */
    public function bulkExport(BulkAccountRequest $request): JsonResponse
    {
        try {
            $workspaceId = auth()->user()->current_workspace_id;
            $accountIds = $request->validated()['account_ids'] ?? [];

            $accounts = QueryBuilder::for(Account::class)
                ->where('workspace_id', $workspaceId)
                ->with(['accountable', 'bankConnection'])
                ->when(!empty($accountIds), function ($query) use ($accountIds) {
                    $query->whereIn('public_id', $accountIds);
                })
                ->get();

            $exportData = $accounts->map(function ($account) {
                return [
                    'id' => $account->public_id,
                    'name' => $account->name,
                    'description' => $account->description,
                    'type' => $account->accountable_type,
                    'current_balance' => $account->current_balance,
                    'currency_code' => $account->currency_code,
                    'is_default' => $account->is_default,
                    'is_manual' => $account->is_manual,
                    'created_at' => $account->created_at->toISOString(),
                    'updated_at' => $account->updated_at->toISOString(),
                ];
            });

            return $this->successResponse([
                'accounts' => $exportData,
                'total_count' => $accounts->count(),
                'exported_at' => now()->toISOString(),
            ], 'Accounts exported successfully.');

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Bulk import accounts.
     */
    public function bulkImport(BulkAccountRequest $request, CreateAccount $action): JsonResponse
    {
        try {
            $importedAccounts = [];
            $errors = [];
            $workspaceId = auth()->user()->current_workspace_id;

            DB::transaction(function () use ($request, $action, &$importedAccounts, &$errors, $workspaceId) {
                foreach ($request->validated()['accounts'] as $index => $accountData) {
                    try {
                        // Check if account with this name already exists
                        $existingAccount = QueryBuilder::for(Account::class)
                            ->where('workspace_id', $workspaceId)
                            ->where('name', $accountData['name'])
                            ->first();

                        if ($existingAccount) {
                            $errors[] = [
                                'index' => $index,
                                'name' => $accountData['name'],
                                'error' => 'Account with this name already exists',
                            ];
                            continue;
                        }

                        $account = $action->create($accountData, isManual: true);
                        $importedAccounts[] = $account;
                    } catch (Throwable $e) {
                        $errors[] = [
                            'index' => $index,
                            'data' => $accountData,
                            'error' => $e->getMessage(),
                        ];
                    }
                }

                // If too many errors occurred, rollback the transaction
                if (count($errors) > count($request->validated()['accounts']) / 2) {
                    throw new \Exception('Too many failures in bulk import');
                }
            });

            // Invalidate cache for the workspace
            $this->cacheService->invalidateWorkspaceCache($workspaceId);

            return $this->successResponse([
                'accounts' => AccountResource::collection($importedAccounts),
                'imported_count' => count($importedAccounts),
                'errors' => $errors,
            ], 'Bulk account import completed.');

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get bulk operation status.
     */
    public function bulkStatus(BulkAccountRequest $request): JsonResponse
    {
        try {
            $workspaceId = auth()->user()->current_workspace_id;
            $accountIds = $request->validated()['account_ids'] ?? [];

            $accounts = QueryBuilder::for(Account::class)
                ->where('workspace_id', $workspaceId)
                ->whereIn('public_id', $accountIds)
                ->get();

            $status = $accounts->map(function ($account) {
                return [
                    'id' => $account->public_id,
                    'name' => $account->name,
                    'status' => 'active', // Could be extended with actual status logic
                    'last_transaction' => $account->transactions()->latest()->first()?->created_at,
                    'balance' => $account->current_balance,
                    'currency' => $account->currency_code,
                ];
            });

            return $this->successResponse([
                'accounts' => $status,
                'total_count' => $accounts->count(),
                'checked_at' => now()->toISOString(),
            ], 'Bulk account status retrieved successfully.');

        } catch (Throwable $e) {
            return $this->handleException($e);
        }
    }
}