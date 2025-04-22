<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Transactions\CreateTransaction;
use App\Actions\Transactions\UpdateTransaction;
use App\Enums\Finance\TransactionType;
use App\Filters\FiltersTransactionsByAccount;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class TransactionController extends Controller
{
    /**
     * Display all transactions.
     */
    public function index(Request $request, #[CurrentUser] User $user): Response
    {
        $perPage = $request->integer('per_page', default: 12);
        /** @var array<string, string> */
        $filters = $request->query('filters', default: []);
        $transactionId = $filters['transaction_id'] ?? null;

        $transaction = $transactionId
            ? Transaction::query()
                ->with(['category', 'merchant'])
                ->wherePublicId($transactionId)
                ->first()
                ?->toResource()
            : null;
        $categories = collect();

        if ($transaction instanceof TransactionResource) {
            $categories = Category::query()
                ->where(function ($query) use ($user): void {
                    $query->where('is_system', true)
                        ->orWhere(function ($query) use ($user): void {
                            $query->where('workspace_id', $user->current_workspace_id)
                                ->where('is_system', false);
                        });
                })
                ->oldest('name')
                ->get()
                ->toResourceCollection();
        }

        return Inertia::render('transactions/page', [
            'transactions' => QueryBuilder::for(Transaction::class)
                ->allowedFilters(['name', 'type', AllowedFilter::custom('account_id', new FiltersTransactionsByAccount)])
                ->allowedSorts(['dated_at', '-dated_at'])
                ->defaultSort('-dated_at')
                ->with(['category', 'merchant'])
                ->paginate($perPage)
                ->withQueryString()
                ->toResourceCollection(),
            'transaction' => $transaction,
            'categories' => $categories,
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(CreateTransactionRequest $request, CreateTransaction $action): RedirectResponse
    {
        $action->handle($request->validated(), isManual: true);

        return to_route('transactions.index')
            ->with('toast', [
                'title' => 'Transaction created successfully',
                'type' => 'success',
            ]);
    }

    /**
     * Update the given transaction.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction, UpdateTransaction $action): RedirectResponse
    {
        $action->handle($transaction, $request->validated());

        return back(303);
    }

    public function destroy(Request $request, Transaction $transaction): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('delete', $transaction)) {
            return back()
                ->with('toast', [
                    'title' => 'You are not allowed to delete this transaction',
                    'type' => 'error',
                ]);
        }

        $transaction->delete();

        /**
         * 1. If the transaction is manual, we need to detach the amount from the account.
         * 2. If the transaction is not manual, we need to add the amount to the account.
         */
        if ($transaction->is_manual) {
            /** @var numeric-string $amount */
            $amount = $transaction->amount;
            /** @var numeric-string $accountCurrentBalance */
            $accountCurrentBalance = $transaction->account->current_balance;

            // Convert negative amount to positive for calculations
            /** @var numeric-string $absoluteAmount */
            $absoluteAmount = ltrim((string) $amount, '-');

            switch ($transaction->type) {
                case TransactionType::Expense:
                    $newCurrentBalance = bcadd($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Income:
                    $newCurrentBalance = bcsub($accountCurrentBalance, $absoluteAmount, 4);
                    break;
                case TransactionType::Transfer:
                    $newCurrentBalance = $accountCurrentBalance;
                    break;
                default:
                    throw new Exception('Invalid transaction type');
            }

            $transaction->account()->update([
                'current_balance' => $newCurrentBalance,
            ]);
        }

        return to_route('transactions.index')
            ->with('toast', [
                'title' => 'Transaction deleted successfully',
                'type' => 'success',
            ]);
    }
}
