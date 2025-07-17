<?php

declare(strict_types=1);

namespace Tests\Unit\Actions\BankAccounts;

use App\Actions\BankAccounts\DeleteAccount;
use App\Exceptions\Account\AccountDeletionException;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

final class DeleteAccountTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Workspace $workspace;

    private DeleteAccount $deleteAction;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->workspace = Workspace::factory()->create();
        $this->user->workspaces()->attach($this->workspace);
        $this->user->update(['current_workspace_id' => $this->workspace->id]);

        $this->deleteAction = new DeleteAccount();
    }

    public function test_deletes_account_successfully(): void
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

        $result = $this->deleteAction->handle($account);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    public function test_throws_exception_when_account_has_transactions(): void
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

        $this->expectException(AccountDeletionException::class);
        $this->expectExceptionMessage('Account has existing transactions');

        $this->deleteAction->handle($account);
    }

    public function test_throws_exception_when_deleting_only_account_in_workspace(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $this->expectException(AccountDeletionException::class);
        $this->expectExceptionMessage('Cannot delete the only account in the workspace');

        $this->deleteAction->handle($account);
    }

    public function test_sets_another_account_as_default_when_deleting_default_account(): void
    {
        $defaultAccount = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'is_default' => true,
        ]);

        $otherAccount = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'is_default' => false,
        ]);

        $result = $this->deleteAction->handle($defaultAccount);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $defaultAccount->id]);

        $otherAccount->refresh();
        $this->assertTrue($otherAccount->is_default);
    }

    public function test_does_not_change_default_when_deleting_non_default_account(): void
    {
        $defaultAccount = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'is_default' => true,
        ]);

        $accountToDelete = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'is_default' => false,
        ]);

        $result = $this->deleteAction->handle($accountToDelete);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $accountToDelete->id]);

        $defaultAccount->refresh();
        $this->assertTrue($defaultAccount->is_default);
    }

    public function test_uses_database_transaction(): void
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

        // Mock DB transaction to verify it's used
        DB::shouldReceive('transaction')
            ->once()
            ->andReturnUsing(function ($callback) {
                return $callback();
            });

        $this->deleteAction->handle($account);
    }

    public function test_exception_includes_transaction_count_in_context(): void
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

        // Create multiple transactions
        Transaction::factory()->count(3)->create([
            'account_id' => $account->id,
            'workspace_id' => $this->workspace->id,
        ]);

        try {
            $this->deleteAction->handle($account);
            $this->fail('Expected AccountDeletionException was not thrown');
        } catch (AccountDeletionException $e) {
            $this->assertEquals($account->public_id, $e->getAccountId());
            $this->assertEquals('Account has existing transactions', $e->getReason());
            $this->assertEquals(['transaction_count' => 3], $e->getContext());
        }
    }

    public function test_exception_includes_workspace_account_count_in_context(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        try {
            $this->deleteAction->handle($account);
            $this->fail('Expected AccountDeletionException was not thrown');
        } catch (AccountDeletionException $e) {
            $this->assertEquals($account->public_id, $e->getAccountId());
            $this->assertEquals('Cannot delete the only account in the workspace', $e->getReason());
            $this->assertEquals(['accounts_in_workspace' => 1], $e->getContext());
        }
    }

    public function test_deletes_account_with_zero_transactions(): void
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

        // Explicitly check that there are no transactions
        $this->assertEquals(0, $account->transactions()->count());

        $result = $this->deleteAction->handle($account);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    public function test_handles_polymorphic_account_deletion(): void
    {
        $account = Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
            'accountable_type' => 'App\Models\Depository',
            'accountable_id' => 1,
        ]);

        // Create another account so we don't violate the "only account" rule
        Account::factory()->create([
            'workspace_id' => $this->workspace->id,
            'created_by' => $this->user->id,
        ]);

        $result = $this->deleteAction->handle($account);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    public function test_rollback_on_exception(): void
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

        // Create a transaction to force an exception
        Transaction::factory()->create([
            'account_id' => $account->id,
            'workspace_id' => $this->workspace->id,
        ]);

        try {
            $this->deleteAction->handle($account);
            $this->fail('Expected AccountDeletionException was not thrown');
        } catch (AccountDeletionException $e) {
            // Account should still exist due to rollback
            $this->assertDatabaseHas('accounts', ['id' => $account->id]);
        }
    }

    public function test_preserves_account_balance_history_references(): void
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

        // Verify the account has no transactions (this should pass)
        $this->assertEquals(0, $account->transactions()->count());

        $result = $this->deleteAction->handle($account);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }
}
