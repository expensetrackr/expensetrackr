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
    private const string CACHE_PREFIX = 'account';

    /**
     * Get cached account by ID.
     */
    public function getAccount(string $accountId, int $workspaceId): ?Account
    {
        $cacheKey = $this->getCacheKey('single', $accountId, $workspaceId);

        $result = Cache::remember($cacheKey, $this->getCacheTTL(), fn () => Account::where('public_id', $accountId)
            ->where('workspace_id', $workspaceId)
            ->with(['accountable', 'bankConnection', 'transactions' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->first());

        $this->addTrackedKey($cacheKey);

        return $result;
    }

    /**
     * Cache a query result.
     */
    public function cacheQuery(string $cacheKey, $result): void
    {
        Cache::put($cacheKey, $result, $this->getCacheTTL());
        $this->addTrackedKey($cacheKey);
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

        $result = Cache::remember($cacheKey, $this->getCacheTTL(), function () use ($workspaceId) {
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

        $this->addTrackedKey($cacheKey);

        return $result;
    }

    /**
     * Get cached accounts by type.
     */
    public function getAccountsByType(int $workspaceId, string $type): Collection
    {
        $cacheKey = $this->getCacheKey('type', $workspaceId, $type);

        $result = Cache::remember($cacheKey, $this->getCacheTTL(), function () use ($workspaceId, $type) {
            $modelClass = $this->getModelClassFromType($type);

            return Account::where('workspace_id', $workspaceId)
                ->where('accountable_type', $modelClass)
                ->with(['accountable', 'bankConnection'])
                ->orderBy('name')
                ->get();
        });

        $this->addTrackedKey($cacheKey);

        return $result;
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

            // Clean up expired tracked keys during warmup
            $this->cleanupExpiredTrackedKeys();

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
     * Get the cache TTL from configuration.
     */
    private function getCacheTTL(): int
    {
        return config('accounts.cache_ttl', 3600);
    }

    /**
     * Clean up expired tracked keys to prevent unlimited growth.
     */
    private function cleanupExpiredTrackedKeys(): void
    {
        $trackedKeys = $this->getTrackedKeys();
        $validKeys = [];

        foreach ($trackedKeys as $key) {
            if (Cache::has($key)) {
                $validKeys[] = $key;
            }
        }

        if (count($validKeys) !== count($trackedKeys)) {
            $keyTracker = self::CACHE_PREFIX.':_tracked_keys';
            Cache::put($keyTracker, $validKeys, $this->getCacheTTL() * 2);
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
            $key .= ":$param";
        }

        return $key;
    }

    /**
     * Get model class from account type.
     */
    private function getModelClassFromType(string $type): string
    {
        $typeMap = config('accounts.type_map', []);
        $defaultType = config('accounts.default_type', 'depository');

        return $typeMap[$type] ?? $typeMap[$defaultType] ?? \App\Models\Depository::class;
    }

    /**
     * Invalidate cache by pattern with targeted key management.
     */
    private function invalidateByPattern(string $pattern): void
    {
        if (Cache::getStore() instanceof \Illuminate\Cache\RedisStore) {
            $keys = Cache::getStore()->connection()->keys($pattern);
            if (! empty($keys)) {
                Cache::getStore()->connection()->del($keys);
            }
        } else {
            // For non-Redis stores, use targeted invalidation to avoid clearing entire cache
            $this->invalidateAccountKeysManually($pattern);
        }
    }

    /**
     * Manually invalidate account-related cache keys for non-Redis stores.
     */
    private function invalidateAccountKeysManually(string $pattern): void
    {
        $trackedKeys = $this->getTrackedKeys();
        $keysToInvalidate = [];

        foreach ($trackedKeys as $key) {
            if ($this->matchesPattern($key, $pattern)) {
                $keysToInvalidate[] = $key;
            }
        }

        foreach ($keysToInvalidate as $key) {
            Cache::forget($key);
            $this->removeTrackedKey($key);
        }
    }

    /**
     * Check if a key matches the given pattern.
     */
    private function matchesPattern(string $key, string $pattern): bool
    {
        // Convert pattern to regex
        $regex = str_replace(['*', ':'], ['.*', ':'], $pattern);
        $regex = '/^'.str_replace('/', '\/', $regex).'$/';

        return preg_match($regex, $key) === 1;
    }

    /**
     * Get tracked cache keys for account-related caches.
     */
    private function getTrackedKeys(): array
    {
        $keyTracker = self::CACHE_PREFIX.':_tracked_keys';

        return Cache::get($keyTracker, []);
    }

    /**
     * Add a key to the tracked keys list.
     */
    private function addTrackedKey(string $key): void
    {
        $keyTracker = self::CACHE_PREFIX.':_tracked_keys';
        $trackedKeys = $this->getTrackedKeys();

        if (! in_array($key, $trackedKeys)) {
            $trackedKeys[] = $key;
            Cache::put($keyTracker, $trackedKeys, $this->getCacheTTL() * 2); // Keep tracker longer
        }
    }

    /**
     * Remove a key from the tracked keys list.
     */
    private function removeTrackedKey(string $key): void
    {
        $keyTracker = self::CACHE_PREFIX.':_tracked_keys';
        $trackedKeys = $this->getTrackedKeys();

        $filteredKeys = array_filter($trackedKeys, fn ($trackedKey) => $trackedKey !== $key);

        if (count($filteredKeys) !== count($trackedKeys)) {
            Cache::put($keyTracker, array_values($filteredKeys), $this->getCacheTTL() * 2);
        }
    }
}
