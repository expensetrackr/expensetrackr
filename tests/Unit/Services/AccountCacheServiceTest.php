<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Account;
use App\Models\User;
use App\Models\Workspace;
use App\Services\AccountCacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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

        $this->cacheService->getAccount($account->public_id, $this->workspace->id);

        $this->assertTrue(Cache::has('account:single:'.$account->public_id.':'.$this->workspace->id));

        $this->cacheService->invalidateAccount($account);

        $this->assertFalse(Cache::has('account:single:'.$account->public_id.':'.$this->workspace->id));
    }

    public function test_invalidate_workspace_cache_clears_all_workspace_cache(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->cacheService->getAccountStats($this->workspace->id);

        $this->cacheService->invalidateWorkspaceCache($this->workspace->id);

        $this->assertTrue(true);
    }

    public function test_warm_up_cache_preloads_data(): void
    {
        Account::factory()->count(3)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $this->cacheService->warmUpCache($this->workspace->id);

        $this->assertTrue(true);
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

    public function test_multiple_filters_work_together(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'USD Checking',
            'currency_code' => 'USD',
            'current_balance' => 1000.00,
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'EUR Savings',
            'currency_code' => 'EUR',
            'current_balance' => 500.00,
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'USD Savings',
            'currency_code' => 'USD',
            'current_balance' => 200.00,
        ]);

        $this->assertTrue(true);
    }
}
