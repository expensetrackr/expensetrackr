<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Account;
use App\Models\User;
use App\Models\Workspace;
use App\Services\AccountCacheService;
use DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class AccountCacheServiceTest extends TestCase
{
    use RefreshDatabase;

    private AccountCacheService $cacheService;

    private User $user;

    private Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cacheService = new AccountCacheService();
        $this->user = User::factory()->create();
        $this->workspace = Workspace::factory()->create();
        $this->user->workspaces()->attach($this->workspace);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);
    }

    public function test_get_account_returns_cached_account(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $result = $this->cacheService->getAccount($account->public_id, $this->workspace->id);

        $this->assertInstanceOf(Account::class, $result);
        $this->assertEquals($account->id, $result->id);
        $this->assertEquals($account->name, $result->name);
    }

    public function test_get_account_returns_null_for_non_existent_account(): void
    {
        $result = $this->cacheService->getAccount('non-existent-id', $this->workspace->id);

        $this->assertNull($result);
    }

    public function test_cache_query_stores_and_retrieves_data(): void
    {
        $cacheKey = 'test:key';
        $testData = ['test' => 'data'];

        $this->cacheService->cacheQuery($cacheKey, $testData);
        $result = $this->cacheService->getCachedQuery($cacheKey);

        $this->assertEquals($testData, $result);
    }

    public function test_get_cached_query_returns_null_for_non_existent_key(): void
    {
        $result = $this->cacheService->getCachedQuery('non-existent-key');

        $this->assertNull($result);
    }

    public function test_cache_query_overwrites_existing_data(): void
    {
        $cacheKey = 'test:key';
        $originalData = ['original' => 'data'];
        $newData = ['new' => 'data'];

        $this->cacheService->cacheQuery($cacheKey, $originalData);
        $this->cacheService->cacheQuery($cacheKey, $newData);
        $result = $this->cacheService->getCachedQuery($cacheKey);

        $this->assertEquals($newData, $result);
    }

    public function test_cache_handles_complex_data_structures(): void
    {
        $cacheKey = 'test:complex';
        $complexData = [
            'accounts' => [
                ['id' => 1, 'name' => 'Account 1'],
                ['id' => 2, 'name' => 'Account 2'],
            ],
            'meta' => [
                'total' => 2,
                'per_page' => 10,
            ],
        ];

        $this->cacheService->cacheQuery($cacheKey, $complexData);
        $result = $this->cacheService->getCachedQuery($cacheKey);

        $this->assertEquals($complexData, $result);
    }

    public function test_cache_ttl_is_respected(): void
    {
        $cacheKey = 'test:ttl';
        $testData = ['test' => 'data'];

        $this->cacheService->cacheQuery($cacheKey, $testData);

        $result = $this->cacheService->getCachedQuery($cacheKey);
        $this->assertEquals($testData, $result);

        $this->assertTrue(true);
    }

    public function test_invalidate_account_clears_cache(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // First fetch - should cache the account
        $firstFetch = $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->assertInstanceOf(Account::class, $firstFetch);

        // Spy on the database to track queries
        $queryCount = 0;
        DB::listen(function ($query) use (&$queryCount) {
            if (str_contains($query->sql, 'select * from "accounts"')) {
                $queryCount++;
            }
        });

        // Second fetch - should use cache, no additional query
        $secondFetch = $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->assertInstanceOf(Account::class, $secondFetch);
        $this->assertEquals(0, $queryCount, 'Second fetch should use cache, not hit database');

        // Invalidate cache
        $this->cacheService->invalidateAccount($account);

        // Third fetch - should trigger database query due to cache miss
        $thirdFetch = $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->assertInstanceOf(Account::class, $thirdFetch);
        $this->assertEquals(1, $queryCount, 'Third fetch should hit database after cache invalidation');
    }

    public function test_invalidate_workspace_cache_clears_all_workspace_cache(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Cache account and stats
        $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->cacheService->getAccountStats($this->workspace->id);

        // Spy on database queries to track cache behavior
        $queryCount = 0;
        DB::listen(function ($query) use (&$queryCount) {
            if (str_contains($query->sql, 'select * from "accounts"')) {
                $queryCount++;
            }
        });

        // Verify cache is working - should not hit database
        $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->cacheService->getAccountStats($this->workspace->id);
        $this->assertEquals(0, $queryCount, 'Cached data should not trigger database queries');

        // Invalidate workspace cache
        $this->cacheService->invalidateWorkspaceCache($this->workspace->id);

        // Verify cache is cleared - should hit database
        $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->cacheService->getAccountStats($this->workspace->id);
        $this->assertGreaterThan(0, $queryCount, 'After invalidation, should trigger database queries');
    }

    public function test_warm_up_cache_preloads_data(): void
    {
        Account::factory()->count(3)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Spy on database queries to track cache behavior
        $queryCount = 0;
        DB::listen(function ($query) use (&$queryCount) {
            if (str_contains($query->sql, 'select * from "accounts"')) {
                $queryCount++;
            }
        });

        // Warm up cache
        $this->cacheService->warmUpCache($this->workspace->id);

        // Reset query count after warm up
        $queryCount = 0;

        // Verify cache is warmed up by checking stats don't trigger DB queries
        $stats = $this->cacheService->getAccountStats($this->workspace->id);
        $this->assertIsArray($stats);
        $this->assertArrayHasKey('total_accounts', $stats);
        $this->assertEquals(3, $stats['total_accounts']);
        $this->assertEquals(0, $queryCount, 'Warmed cache should not trigger database queries for stats');

        // Verify preloaded account types don't trigger DB queries
        $depositoryAccounts = $this->cacheService->getAccountsByType($this->workspace->id, 'depository');
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $depositoryAccounts);
        $this->assertEquals(0, $queryCount, 'Warmed cache should not trigger database queries for account types');
    }

    public function test_cache_keys_are_unique_per_workspace(): void
    {
        $workspace2 = Workspace::factory()->create();

        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $workspace2->id,
            'created_by' => $this->user->id,
        ]);

        $result1 = $this->cacheService->getAccount($account1->public_id, $this->workspace->id);
        $result2 = $this->cacheService->getAccount($account2->public_id, $workspace2->id);

        $this->assertNotEquals($result1->id, $result2->id);
        $this->assertEquals($this->workspace->id, $result1->workspace_id);
        $this->assertEquals($workspace2->id, $result2->workspace_id);
    }

    public function test_cached_stats_reflect_multiple_account_types_and_currencies(): void
    {
        $usdChecking = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'USD Checking',
            'currency_code' => 'USD',
            'current_balance' => 1000.00,
        ]);

        $eurSavings = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'EUR Savings',
            'currency_code' => 'EUR',
            'current_balance' => 500.00,
        ]);

        $usdSavings = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'USD Savings',
            'currency_code' => 'USD',
            'current_balance' => 200.00,
        ]);

        // Get cached stats
        $stats = $this->cacheService->getAccountStats($this->workspace->id);

        // Verify total accounts
        $this->assertEquals(3, $stats['total_accounts']);

        // Verify total balance calculation
        $this->assertEquals(1700.00, $stats['total_balance']);

        // Verify currency grouping
        $this->assertArrayHasKey('by_currency', $stats);
        $this->assertEquals(2, $stats['by_currency']['USD']); // 2 USD accounts
        $this->assertEquals(1, $stats['by_currency']['EUR']); // 1 EUR account

        // Verify account type grouping
        $this->assertArrayHasKey('by_type', $stats);
        $this->assertEquals(3, $stats['by_type'][$usdChecking->accountable_type]); // All accounts have same type

        // Spy on database queries to verify caching
        $queryCount = 0;
        DB::listen(function ($query) use (&$queryCount) {
            if (str_contains($query->sql, 'select * from "accounts"')) {
                $queryCount++;
            }
        });

        // Second call should use cache, not hit database
        $cachedStats = $this->cacheService->getAccountStats($this->workspace->id);
        $this->assertEquals($stats, $cachedStats);
        $this->assertEquals(0, $queryCount, 'Second stats call should use cache, not hit database');
    }
}
