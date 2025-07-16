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

final class BulkAccountControllerTest extends TestCase
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

    public function test_bulk_create_creates_multiple_accounts(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Account 1',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
                [
                    'name' => 'Account 2',
                    'currency_code' => 'EUR',
                    'initial_balance' => 500.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'created_count' => 2,
                    'errors' => [],
                ],
            ]);

        $this->assertDatabaseHas('accounts', ['name' => 'Account 1']);
        $this->assertDatabaseHas('accounts', ['name' => 'Account 2']);
    }

    public function test_bulk_create_validates_required_fields(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Account 1',
                    // Missing required fields
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'accounts.0.currency_code',
                'accounts.0.initial_balance',
                'accounts.0.type',
            ]);
    }

    public function test_bulk_create_validates_credit_card_fields(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Credit Card',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::CreditCard->value,
                    // Missing required credit card fields
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'accounts.0.available_credit',
                'accounts.0.minimum_payment',
                'accounts.0.apr',
                'accounts.0.annual_fee',
                'accounts.0.expires_at',
            ]);
    }

    public function test_bulk_create_enforces_maximum_limit(): void
    {
        $accounts = [];
        for ($i = 0; $i < 51; $i++) {
            $accounts[] = [
                'name' => "Account {$i}",
                'currency_code' => 'USD',
                'initial_balance' => 1000.00,
                'type' => AccountType::Depository->value,
            ];
        }

        $response = $this->postJson('/api/accounts/bulk/create', ['accounts' => $accounts]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['accounts']);
    }

    public function test_bulk_create_validates_duplicate_names(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Duplicate Name',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
                [
                    'name' => 'Duplicate Name',
                    'currency_code' => 'USD',
                    'initial_balance' => 500.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['accounts']);
    }

    public function test_bulk_update_updates_multiple_accounts(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Original Name 1',
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Original Name 2',
        ]);

        $updateData = [
            'accounts' => [
                [
                    'id' => $account1->public_id,
                    'name' => 'Updated Name 1',
                ],
                [
                    'id' => $account2->public_id,
                    'name' => 'Updated Name 2',
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/update', $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'updated_count' => 2,
                    'errors' => [],
                ],
            ]);

        $this->assertDatabaseHas('accounts', ['id' => $account1->id, 'name' => 'Updated Name 1']);
        $this->assertDatabaseHas('accounts', ['id' => $account2->id, 'name' => 'Updated Name 2']);
    }

    public function test_bulk_update_validates_account_existence(): void
    {
        $updateData = [
            'accounts' => [
                [
                    'id' => 'non-existent-id',
                    'name' => 'Updated Name',
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/update', $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['accounts.0.id']);
    }

    public function test_bulk_delete_deletes_multiple_accounts(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $deleteData = [
            'account_ids' => [
                $account1->public_id,
                $account2->public_id,
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/delete', $deleteData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'deleted_count' => 2,
                    'errors' => [],
                ],
            ]);

        $this->assertDatabaseMissing('accounts', ['id' => $account1->id]);
        $this->assertDatabaseMissing('accounts', ['id' => $account2->id]);
    }

    public function test_bulk_delete_handles_accounts_with_transactions(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create a transaction for account1
        Transaction::factory()->create([
            'account_id' => $account1->id,
            'workspace_id' => $this->workspace->id,
        ]);

        $deleteData = [
            'account_ids' => [
                $account1->public_id,
                $account2->public_id,
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/delete', $deleteData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'deleted_count' => 1,
                ],
            ]);

        // Account1 should still exist due to transactions
        $this->assertDatabaseHas('accounts', ['id' => $account1->id]);
        // Account2 should be deleted
        $this->assertDatabaseMissing('accounts', ['id' => $account2->id]);
    }

    public function test_bulk_export_exports_all_accounts(): void
    {
        Account::factory()->count(3)->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->postJson('/api/accounts/bulk/export');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_count' => 3,
                ],
            ])
            ->assertJsonStructure([
                'data' => [
                    'accounts' => [
                        '*' => [
                            'id',
                            'name',
                            'description',
                            'type',
                            'current_balance',
                            'currency_code',
                            'is_default',
                            'is_manual',
                            'created_at',
                            'updated_at',
                        ],
                    ],
                ],
            ]);
    }

    public function test_bulk_export_exports_specific_accounts(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create a third account that shouldn't be exported
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $exportData = [
            'account_ids' => [
                $account1->public_id,
                $account2->public_id,
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/export', $exportData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_count' => 2,
                ],
            ]);
    }

    public function test_bulk_import_imports_accounts(): void
    {
        $importData = [
            'accounts' => [
                [
                    'name' => 'Imported Account 1',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
                [
                    'name' => 'Imported Account 2',
                    'currency_code' => 'EUR',
                    'initial_balance' => 500.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/import', $importData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'imported_count' => 2,
                    'errors' => [],
                ],
            ]);

        $this->assertDatabaseHas('accounts', ['name' => 'Imported Account 1']);
        $this->assertDatabaseHas('accounts', ['name' => 'Imported Account 2']);
    }

    public function test_bulk_import_handles_duplicate_names(): void
    {
        // Create an existing account
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'name' => 'Existing Account',
        ]);

        $importData = [
            'accounts' => [
                [
                    'name' => 'Existing Account',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
                [
                    'name' => 'New Account',
                    'currency_code' => 'EUR',
                    'initial_balance' => 500.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/import', $importData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'imported_count' => 1,
                ],
            ]);

        $this->assertDatabaseHas('accounts', ['name' => 'New Account']);
    }

    public function test_bulk_status_returns_account_status(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $statusData = [
            'account_ids' => [
                $account1->public_id,
                $account2->public_id,
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/status', $statusData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_count' => 2,
                ],
            ])
            ->assertJsonStructure([
                'data' => [
                    'accounts' => [
                        '*' => [
                            'id',
                            'name',
                            'status',
                            'balance',
                            'currency',
                        ],
                    ],
                ],
            ]);
    }

    public function test_bulk_operations_require_authentication(): void
    {
        Sanctum::actingAs(null);

        $response = $this->postJson('/api/accounts/bulk/create', [
            'accounts' => [
                [
                    'name' => 'Test Account',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ]);

        $response->assertStatus(401);
    }

    public function test_bulk_create_uses_database_transactions(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Valid Account',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
                [
                    'name' => 'Invalid Account',
                    'currency_code' => 'INVALID', // Invalid currency
                    'initial_balance' => 1000.00,
                    'type' => AccountType::Depository->value,
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        // Should fail due to validation
        $response->assertStatus(422);

        // No accounts should be created due to transaction rollback
        $this->assertDatabaseMissing('accounts', ['name' => 'Valid Account']);
        $this->assertDatabaseMissing('accounts', ['name' => 'Invalid Account']);
    }

    public function test_bulk_operations_validate_workspace_access(): void
    {
        $otherWorkspace = Workspace::factory()->create();
        $otherAccount = Account::factory()->create([
            'workspace_id' => $otherWorkspace->id,
            'created_by' => $this->user->id,
        ]);

        $response = $this->postJson('/api/accounts/bulk/delete', [
            'account_ids' => [$otherAccount->public_id],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['account_ids']);
    }

    public function test_bulk_operations_handle_partial_failures(): void
    {
        $account1 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $account2 = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $deleteData = [
            'account_ids' => [
                $account1->public_id,
                'non-existent-id',
                $account2->public_id,
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/delete', $deleteData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'deleted_count' => 2,
                ],
            ]);

        $this->assertDatabaseMissing('accounts', ['id' => $account1->id]);
        $this->assertDatabaseMissing('accounts', ['id' => $account2->id]);
    }

    public function test_bulk_create_with_credit_card_accounts(): void
    {
        $accountsData = [
            'accounts' => [
                [
                    'name' => 'Credit Card 1',
                    'currency_code' => 'USD',
                    'initial_balance' => 500.00,
                    'type' => AccountType::CreditCard->value,
                    'available_credit' => 5000.00,
                    'minimum_payment' => 25.00,
                    'apr' => 18.99,
                    'annual_fee' => 95.00,
                    'expires_at' => '2026-12-31',
                ],
                [
                    'name' => 'Credit Card 2',
                    'currency_code' => 'USD',
                    'initial_balance' => 1000.00,
                    'type' => AccountType::CreditCard->value,
                    'available_credit' => 3000.00,
                    'minimum_payment' => 50.00,
                    'apr' => 22.99,
                    'annual_fee' => 0.00,
                    'expires_at' => '2027-06-30',
                ],
            ],
        ];

        $response = $this->postJson('/api/accounts/bulk/create', $accountsData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'created_count' => 2,
                    'errors' => [],
                ],
            ]);

        $this->assertDatabaseHas('accounts', ['name' => 'Credit Card 1']);
        $this->assertDatabaseHas('accounts', ['name' => 'Credit Card 2']);
    }
}