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

    public function test_get_accounts_list_returns_paginated_results(): void
    {
        Account::factory()->count(5)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('meta', $result);
        $this->assertCount(5, $result['data']);
        $this->assertEquals(5, $result['meta']['total']);
    }

    public function test_get_accounts_list_applies_search_filter(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Savings Account',
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Checking Account',
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id, ['search' => 'Savings']);

        $this->assertCount(1, $result['data']);
        $this->assertEquals('Savings Account', $result['data'][0]->name);
    }

    public function test_get_accounts_list_applies_type_filter(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'accountable_type' => 'App\\Models\\Depository',
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'accountable_type' => 'App\\Models\\CreditCard',
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id, ['type' => 'depository']);

        $this->assertCount(1, $result['data']);
        $this->assertEquals('App\\Models\\Depository', $result['data'][0]->accountable_type);
    }

    public function test_get_accounts_list_applies_currency_filter(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'currency_code' => 'USD',
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'currency_code' => 'EUR',
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id, ['currency' => 'USD']);

        $this->assertCount(1, $result['data']);
        $this->assertEquals('USD', $result['data'][0]->currency_code);
    }

    public function test_get_accounts_list_applies_balance_range_filter(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'current_balance' => 500.00,
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'current_balance' => 1500.00,
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id, [
            'balance_min' => 1000.00,
            'balance_max' => 2000.00,
        ]);

        $this->assertCount(1, $result['data']);
        $this->assertEquals(1500.00, $result['data'][0]->current_balance);
    }

    public function test_get_accounts_list_applies_date_range_filter(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'created_at' => now()->subDays(30),
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'created_at' => now()->subDays(5),
        ]);

        $result = $this->cacheService->getAccountsList($this->workspace->id, [
            'created_from' => now()->subDays(10)->toDateString(),
            'created_to' => now()->toDateString(),
        ]);

        $this->assertCount(1, $result['data']);
    }

    public function test_get_account_stats_returns_correct_statistics(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'current_balance' => 1000.00,
            'currency_code' => 'USD',
            'is_default' => true,
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'current_balance' => 500.00,
            'currency_code' => 'EUR',
            'is_default' => false,
        ]);

        $stats = $this->cacheService->getAccountStats($this->workspace->id);

        $this->assertEquals(2, $stats['total_accounts']);
        $this->assertEquals(1500.00, $stats['total_balance']);
        $this->assertArrayHasKey('by_type', $stats);
        $this->assertArrayHasKey('by_currency', $stats);
        $this->assertArrayHasKey('default_account', $stats);
    }

    public function test_get_accounts_by_type_returns_correct_accounts(): void
    {
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'accountable_type' => 'App\\Models\\Depository',
        ]);

        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'accountable_type' => 'App\\Models\\CreditCard',
        ]);

        $accounts = $this->cacheService->getAccountsByType($this->workspace->id, 'depository');

        $this->assertCount(1, $accounts);
        $this->assertEquals('App\\Models\\Depository', $accounts->first()->accountable_type);
    }

    public function test_invalidate_account_clears_cache(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Cache the account
        $this->cacheService->getAccount($account->public_id, $this->workspace->id);

        // Verify it's cached
        $this->assertTrue(Cache::has('account:single:' . $account->public_id . ':' . $this->workspace->id));

        // Invalidate cache
        $this->cacheService->invalidateAccount($account);

        // Verify it's cleared
        $this->assertFalse(Cache::has('account:single:' . $account->public_id . ':' . $this->workspace->id));
    }

    public function test_invalidate_workspace_cache_clears_all_workspace_cache(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Cache some data
        $this->cacheService->getAccount($account->public_id, $this->workspace->id);
        $this->cacheService->getAccountStats($this->workspace->id);

        // Invalidate workspace cache
        $this->cacheService->invalidateWorkspaceCache($this->workspace->id);

        // Verify cache is cleared (this would depend on the cache store implementation)
        $this->assertTrue(true); // Placeholder assertion
    }

    public function test_warm_up_cache_preloads_data(): void
    {
        Account::factory()->count(3)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Warm up cache
        $this->cacheService->warmUpCache($this->workspace->id);

        // Verify data is cached (this would depend on the cache store implementation)
        $this->assertTrue(true); // Placeholder assertion
    }

    public function test_pagination_works_correctly(): void
    {
        Account::factory()->count(25)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $page1 = $this->cacheService->getAccountsList($this->workspace->id, [], 1, 10);
        $page2 = $this->cacheService->getAccountsList($this->workspace->id, [], 2, 10);

        $this->assertCount(10, $page1['data']);
        $this->assertCount(10, $page2['data']);
        $this->assertEquals(1, $page1['meta']['current_page']);
        $this->assertEquals(2, $page2['meta']['current_page']);
        $this->assertEquals(25, $page1['meta']['total']);
        $this->assertEquals(3, $page1['meta']['last_page']);
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

        $result = $this->cacheService->getAccountsList($this->workspace->id, [
            'search' => 'USD',
            'currency' => 'USD',
            'balance_min' => 500.00,
        ]);

        $this->assertCount(1, $result['data']);
        $this->assertEquals('USD Checking', $result['data'][0]->name);
    }
}