<?php

declare(strict_types=1);

namespace App\Actions\BankAccounts;

use App\Exceptions\Account\AccountDeletionException;
use App\Models\Account;
use Illuminate\Support\Facades\DB;

final class DeleteAccount
{
    /**
     * Delete an account and all its associated data.
     */
    public function handle(Account $account): void
    {
        DB::transaction(function () use ($account) {
            // Check if the account has any transactions
            if ($account->transactions()->exists()) {
                $transactionCount = $account->transactions()->count();
                throw new AccountDeletionException(
                    $account->public_id,
                    'Account has existing transactions',
                    ['transaction_count' => $transactionCount]
                );
            }

            // Check if this is the only account in the workspace
            $accountsInWorkspace = Account::where('workspace_id', $account->workspace_id)->count();
            if ($accountsInWorkspace === 1) {
                throw new AccountDeletionException(
                    $account->public_id,
                    'Cannot delete the only account in the workspace',
                    ['accounts_in_workspace' => $accountsInWorkspace]
                );
            }

            // If this is the default account, set another account as default
            if ($account->is_default) {
                $this->reassignDefaultAccount($account);
            }

            // Delete associated account balances
            $account->balances()->delete();

            // Delete the accountable model (polymorphic relationship)
            $accountable = $account->accountable;
            if ($accountable) {
                $accountable->delete();
            }

            // Finally, delete the account itself
            $account->delete();
        });
    }

    /**
     * Reassign default account to another account in the workspace.
     */
    private function reassignDefaultAccount(Account $account): void
    {
        // Find another account in the same workspace to make default
        // Use oldest account (created_at ASC) for deterministic selection
        $newDefaultAccount = Account::where('workspace_id', $account->workspace_id)
            ->where('id', '!=', $account->id)
            ->orderBy('created_at', 'asc')
            ->first();

        if ($newDefaultAccount) {
            $newDefaultAccount->update(['is_default' => true]);
        }
    }
}
