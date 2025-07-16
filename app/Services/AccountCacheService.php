<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Account;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class AccountCacheService
{
    private const int CACHE_TTL = 3600; // 1 hour

    private const string CACHE_PREFIX = 'account';

    /**
     * Get cached account by ID.
     */
    public function getAccount(string $accountId, int $workspaceId): ?Account
    {
        $cacheKey = $this->getCacheKey('single', $accountId, $workspaceId);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($accountId, $workspaceId) {
            return Account::where('public_id', $accountId)
                ->where('workspace_id', $workspaceId)
                ->with(['accountable', 'bankConnection', 'transactions' => function ($query) {
                    $query->latest()->limit(5);
                }])
                ->first();
        });
    }

    /**
     * Cache a query result.
     */
    public function cacheQuery(string $cacheKey, $result): void
    {
        Cache::put($cacheKey, $result, self::CACHE_TTL);
    }

    /**
     * Get cached query result.
     */
    public function getCachedQuery(string $cacheKey)
    {
        return Cache::get($cacheKey);
    }

    /**
     * Get cached account statistics for workspace.
     */
    public function getAccountStats(int $workspaceId): array
    {
        $cacheKey = $this->getCacheKey('stats', $workspaceId);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($workspaceId) {
            $accounts = Account::where('workspace_id', $workspaceId)->get();

            $stats = [
                'total_accounts' => $accounts->count(),
                'total_balance' => $accounts->sum('current_balance'),
                'by_type' => $accounts->groupBy('accountable_type')->map->count(),
                'by_currency' => $accounts->groupBy('currency_code')->map->count(),
                'default_account' => $accounts->where('is_default', true)->first()?->public_id,
            ];

            return $stats;
        });
    }

    /**
     * Get cached accounts by type.
     */
    public function getAccountsByType(int $workspaceId, string $type): Collection
    {
        $cacheKey = $this->getCacheKey('type', $workspaceId, $type);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($workspaceId, $type) {
            $modelClass = $this->getModelClassFromType($type);

            return Account::where('workspace_id', $workspaceId)
                ->where('accountable_type', $modelClass)
                ->with(['accountable', 'bankConnection'])
                ->orderBy('name')
                ->get();
        });
    }

    /**
     * Invalidate account cache.
     */
    public function invalidateAccount(Account $account): void
    {
        $patterns = [
            $this->getCacheKey('single', $account->public_id, $account->workspace_id),
            "accounts:query:{$account->workspace_id}:*",
            "accounts:stats:{$account->workspace_id}",
            $this->getCacheKey('type', $account->workspace_id, '*'),
        ];

        foreach ($patterns as $pattern) {
            if (str_contains($pattern, '*')) {
                $this->invalidateByPattern($pattern);
            } else {
                Cache::forget($pattern);
            }
        }

        Log::info('Account cache invalidated', [
            'account_id' => $account->public_id,
            'workspace_id' => $account->workspace_id,
        ]);
    }

    /**
     * Invalidate all account caches for a workspace.
     */
    public function invalidateWorkspaceCache(int $workspaceId): void
    {
        $patterns = [
            $this->getCacheKey('single', '*', $workspaceId),
            "accounts:query:{$workspaceId}:*",
            "accounts:stats:{$workspaceId}",
            $this->getCacheKey('type', $workspaceId, '*'),
        ];

        foreach ($patterns as $pattern) {
            $this->invalidateByPattern($pattern);
        }

        Log::info('Workspace account cache invalidated', [
            'workspace_id' => $workspaceId,
        ]);
    }

    /**
     * Warm up cache for frequently accessed data.
     */
    public function warmUpCache(int $workspaceId): void
    {
        try {
            $this->getAccountStats($workspaceId);

            $commonTypes = ['depository', 'credit_card', 'loan'];
            foreach ($commonTypes as $type) {
                $this->getAccountsByType($workspaceId, $type);
            }

            Log::info('Account cache warmed up', [
                'workspace_id' => $workspaceId,
            ]);
        } catch (Exception $e) {
            Log::error('Cache warm-up failed', [
                'workspace_id' => $workspaceId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generate cache key.
     */
    private function getCacheKey(string $type, ...$params): string
    {
        $key = self::CACHE_PREFIX.':'.$type;

        foreach ($params as $param) {
            if (is_array($param)) {
                $param = md5(serialize($param));
            }
            $key .= ':'.$param;
        }

        return $key;
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

    /**
     * Invalidate cache by pattern (Redis specific).
     */
    private function invalidateByPattern(string $pattern): void
    {
        if (Cache::getStore() instanceof \Illuminate\Cache\RedisStore) {
            $keys = Cache::getStore()->connection()->keys($pattern);
            if (! empty($keys)) {
                Cache::getStore()->connection()->del($keys);
            }
        } else {
            // For other cache stores, we'll need to track keys manually
            // This is a simplified approach
            Cache::flush();
        }
    }
}
