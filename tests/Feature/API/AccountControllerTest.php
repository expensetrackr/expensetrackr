<?php

declare(strict_types=1);

use App\Enums\Finance\AccountType;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->create();
    $this->user->workspaces()->attach($this->workspace);
    $this->user->update(['current_workspace_id' => $this->workspace->id]);

    Sanctum::actingAs($this->user, ['*']);
});

test('index returns paginated accounts', function () {
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
});

test('index filters by workspace', function () {
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
    expect($response->json('data.total'))->toBe(3);
});

test('store creates account successfully', function () {
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
});

test('store validates required fields', function () {
    $response = $this->postJson('/api/accounts', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors([
            'name',
            'currency_code',
            'initial_balance',
            'type',
        ]);
});

test('store validates credit card fields', function () {
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
});

test('store creates credit card successfully', function () {
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
});

test('show returns account details', function () {
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
});

test('show returns 404 for non existent account', function () {
    $response = $this->getJson('/api/accounts/non-existent-id');

    $response->assertStatus(404);
});

test('show returns 403 for unauthorized access', function () {
    $otherUser = User::factory()->create();
    $otherWorkspace = Workspace::factory()->create();
    $otherAccount = Account::factory()->create([
        'workspace_id' => $otherWorkspace->id,
        'created_by' => $otherUser->id,
    ]);

    $response = $this->getJson("/api/accounts/{$otherAccount->public_id}");

    $response->assertStatus(403);
});

test('update modifies account successfully', function () {
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
});

test('update validates field types', function () {
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
});

test('update returns 404 for non existent account', function () {
    $response = $this->putJson('/api/accounts/non-existent-id', [
        'name' => 'Updated Name',
    ]);

    $response->assertStatus(404);
});

test('update returns 403 for unauthorized access', function () {
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
});

test('destroy deletes account successfully', function () {
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
});

test('destroy returns 422 when account has transactions', function () {
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
});

test('destroy returns 422 when deleting only account', function () {
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
});

test('destroy returns 404 for non existent account', function () {
    $response = $this->deleteJson('/api/accounts/non-existent-id');

    $response->assertStatus(404);
});

test('destroy returns 403 for unauthorized access', function () {
    $otherUser = User::factory()->create();
    $otherWorkspace = Workspace::factory()->create();
    $otherAccount = Account::factory()->create([
        'workspace_id' => $otherWorkspace->id,
        'created_by' => $otherUser->id,
    ]);

    $response = $this->deleteJson("/api/accounts/{$otherAccount->public_id}");

    $response->assertStatus(403);
});

test('requires authentication', function () {
    Sanctum::actingAs(null);

    $response = $this->getJson('/api/accounts');

    $response->assertStatus(401);
});

test('pagination parameters work', function () {
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
});

test('search filters work', function () {
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
    expect($data)->toHaveCount(1);
    expect($data[0]['name'])->toBe('Savings Account');
});

test('type filter works', function () {
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
    expect($data)->toHaveCount(1);
    expect($data[0]['type'])->toBe('depository');
});

test('handles server errors gracefully', function () {
    // Force a server error by providing invalid data that would cause an exception
    $response = $this->postJson('/api/accounts', [
        'name' => 'Test Account',
        'currency_code' => 'USD',
        'initial_balance' => 'invalid-balance-format',
        'type' => AccountType::Depository->value,
    ]);

    $response->assertStatus(422); // Should return validation error, not 500
});

test('returns consistent json structure', function () {
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
});
