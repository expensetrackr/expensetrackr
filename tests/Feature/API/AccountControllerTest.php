<?php

declare(strict_types=1);

namespace Tests\Feature\API;

use App\Enums\Finance\AccountType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class AccountControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->workspace = Workspace::factory()->create();
        $this->user->workspaces()->attach($this->workspace);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);
        
        Sanctum::actingAs($this->user, ['*']);
    }

    public function test_index_returns_paginated_accounts(): void
    {
        Account::factory()->count(15)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/accounts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'current_page',
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'description',
                            'type',
                            'current_balance',
                            'currency_code',
                            'is_default',
                            'created_at',
                            'updated_at',
                        ],
                    ],
                    'total',
                    'per_page',
                ],
                'message',
            ]);
    }

    public function test_index_filters_by_workspace(): void
    {
        // Create accounts for this workspace
        Account::factory()->count(3)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create accounts for another workspace
        $otherWorkspace = Workspace::factory()->create();
        Account::factory()->count(2)->create([
            'workspace_id' => $otherWorkspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/accounts');

        $response->assertStatus(200);
        $this->assertEquals(3, $response->json('data.total'));
    }

    public function test_store_creates_account_successfully(): void
    {
        $accountData = [
            'name' => 'Test Account',
            'description' => 'Test Description',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::Depository->value,
            'is_default' => true,
        ];

        $response = $this->postJson('/api/accounts', $accountData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'description',
                    'type',
                    'current_balance',
                    'currency_code',
                    'is_default',
                ],
                'message',
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Test Account',
                    'description' => 'Test Description',
                    'currency_code' => 'USD',
                    'current_balance' => 1000.00,
                    'type' => 'depository',
                    'is_default' => true,
                ],
            ]);

        $this->assertDatabaseHas('accounts', [
            'name' => 'Test Account',
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $response = $this->postJson('/api/accounts', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'currency_code',
                'initial_balance',
                'type',
            ]);
    }

    public function test_store_validates_credit_card_fields(): void
    {
        $accountData = [
            'name' => 'Credit Card',
            'currency_code' => 'USD',
            'initial_balance' => 1000.00,
            'type' => AccountType::CreditCard->value,
            // Missing required credit card fields
        ];

        $response = $this->postJson('/api/accounts', $accountData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'available_credit',
                'minimum_payment',
                'apr',
                'annual_fee',
                'expires_at',
            ]);
    }

    public function test_store_creates_credit_card_successfully(): void
    {
        $accountData = [
            'name' => 'Credit Card',
            'currency_code' => 'USD',
            'initial_balance' => 500.00,
            'type' => AccountType::CreditCard->value,
            'available_credit' => 5000.00,
            'minimum_payment' => 25.00,
            'apr' => 18.99,
            'annual_fee' => 95.00,
            'expires_at' => '2026-12-31',
        ];

        $response = $this->postJson('/api/accounts', $accountData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Credit Card',
                    'type' => 'credit_card',
                    'current_balance' => 500.00,
                ],
            ]);
    }

    public function test_show_returns_account_details(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson("/api/accounts/{$account->public_id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $account->public_id,
                    'name' => $account->name,
                    'current_balance' => $account->current_balance,
                    'currency_code' => $account->currency_code,
                ],
            ]);
    }

    public function test_show_returns_404_for_non_existent_account(): void
    {
        $response = $this->getJson('/api/accounts/non-existent-id');

        $response->assertStatus(404);
    }

    public function test_show_returns_403_for_unauthorized_access(): void
    {
        $otherUser = User::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $otherAccount = Account::factory()->create([
            'workspace_id' => $otherWorkspace->id,
            'created_by' => $otherUser->id,
        ]);

        $response = $this->getJson("/api/accounts/{$otherAccount->public_id}");

        $response->assertStatus(403);
    }

    public function test_update_modifies_account_successfully(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Original Name',
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated Description',
            'currency_code' => 'EUR',
        ];

        $response = $this->putJson("/api/accounts/{$account->public_id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $account->public_id,
                    'name' => 'Updated Name',
                    'description' => 'Updated Description',
                    'currency_code' => 'EUR',
                ],
            ]);

        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
            'name' => 'Updated Name',
            'currency_code' => 'EUR',
        ]);
    }

    public function test_update_validates_field_types(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $updateData = [
            'name' => 123, // Should be string
            'currency_code' => 'TOOLONG', // Should be max 3 chars
            'is_default' => 'not-boolean', // Should be boolean
        ];

        $response = $this->putJson("/api/accounts/{$account->public_id}", $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'currency_code',
                'is_default',
            ]);
    }

    public function test_update_returns_404_for_non_existent_account(): void
    {
        $response = $this->putJson('/api/accounts/non-existent-id', [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(404);
    }

    public function test_update_returns_403_for_unauthorized_access(): void
    {
        $otherUser = User::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $otherAccount = Account::factory()->create([
            'workspace_id' => $otherWorkspace->id,
            'created_by' => $otherUser->id,
        ]);

        $response = $this->putJson("/api/accounts/{$otherAccount->public_id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(403);
    }

    public function test_destroy_deletes_account_successfully(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/accounts/{$account->public_id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Account deleted successfully.',
            ]);

        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    public function test_destroy_returns_422_when_account_has_transactions(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create a transaction for the account
        Transaction::factory()->create([
            'account_id' => $account->id,
            'workspace_id' => $this->workspace->id,
        ]);

        $response = $this->deleteJson("/api/accounts/{$account->public_id}");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'code' => 'ACCOUNT_DELETION_FAILED',
                'reason' => 'Account has existing transactions',
            ]);
    }

    public function test_destroy_returns_422_when_deleting_only_account(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/accounts/{$account->public_id}");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'code' => 'ACCOUNT_DELETION_FAILED',
                'reason' => 'Cannot delete the only account in the workspace',
            ]);
    }

    public function test_destroy_returns_404_for_non_existent_account(): void
    {
        $response = $this->deleteJson('/api/accounts/non-existent-id');

        $response->assertStatus(404);
    }

    public function test_destroy_returns_403_for_unauthorized_access(): void
    {
        $otherUser = User::factory()->create();
        $otherWorkspace = Workspace::factory()->create();
        $otherAccount = Account::factory()->create([
            'workspace_id' => $otherWorkspace->id,
            'created_by' => $otherUser->id,
        ]);

        $response = $this->deleteJson("/api/accounts/{$otherAccount->public_id}");

        $response->assertStatus(403);
    }

    public function test_requires_authentication(): void
    {
        Sanctum::actingAs(null);

        $response = $this->getJson('/api/accounts');

        $response->assertStatus(401);
    }

    public function test_pagination_parameters_work(): void
    {
        Account::factory()->count(15)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->getJson('/api/accounts?page=2&per_page=5');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'current_page' => 2,
                    'per_page' => 5,
                ],
            ]);
    }

    public function test_search_filters_work(): void
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

        $response = $this->getJson('/api/accounts?search=Savings');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertCount(1, $data);
        $this->assertEquals('Savings Account', $data[0]['name']);
    }

    public function test_type_filter_works(): void
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

        $response = $this->getJson('/api/accounts?type=depository');

        $response->assertStatus(200);
        $data = $response->json('data.data');
        $this->assertCount(1, $data);
        $this->assertEquals('depository', $data[0]['type']);
    }

    public function test_handles_server_errors_gracefully(): void
    {
        // Force a server error by providing invalid data that would cause an exception
        $response = $this->postJson('/api/accounts', [
            'name' => 'Test Account',
            'currency_code' => 'USD',
            'initial_balance' => 'invalid-balance-format',
            'type' => AccountType::Depository->value,
        ]);

        $response->assertStatus(422); // Should return validation error, not 500
    }

    public function test_returns_consistent_json_structure(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $endpoints = [
            ['method' => 'GET', 'url' => '/api/accounts'],
            ['method' => 'GET', 'url' => "/api/accounts/{$account->public_id}"],
            ['method' => 'POST', 'url' => '/api/accounts', 'data' => [
                'name' => 'New Account',
                'currency_code' => 'USD',
                'initial_balance' => 1000.00,
                'type' => AccountType::Depository->value,
            ]],
            ['method' => 'PUT', 'url' => "/api/accounts/{$account->public_id}", 'data' => [
                'name' => 'Updated Account',
            ]],
        ];

        foreach ($endpoints as $endpoint) {
            $response = match ($endpoint['method']) {
                'GET' => $this->getJson($endpoint['url']),
                'POST' => $this->postJson($endpoint['url'], $endpoint['data']),
                'PUT' => $this->putJson($endpoint['url'], $endpoint['data']),
            };

            $response->assertJsonStructure([
                'success',
                'data',
                'message',
            ]);
        }
    }
}