<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Transactions\CreateTransaction;
use App\Actions\Transactions\UpdateTransaction;
use App\Facades\Forex;
use App\Filters\FiltersTransactionsByAccount;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class TransactionController
{
    /**
     * Display all transactions.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', default: 12);
        $transactionId = $request->string('transaction_id');

        $transaction = $transactionId->isNotEmpty()
            ? new TransactionResource(
                Transaction::query()
                    ->wherePublicId($transactionId->value())
                    ->with(['account', 'category', 'merchant'])
                    ->first()
            )
            : null;
        $categories = collect();

        if ($transaction instanceof TransactionResource) {
            $categories = CategoryResource::collection(
                Category::query()
                    ->where(function ($query) use ($request): void {
                        $query->where('is_system', true)
                            ->orWhere(function ($query) use ($request): void {
                                $query->where('workspace_id', $request->user()->current_workspace_id)
                                    ->where('is_system', false);
                            });
                    })
                    ->orderBy('name', 'asc')
                    ->get()
            );
        }

        return Inertia::render('transactions/page', [
            'transactions' => TransactionResource::collection(
                QueryBuilder::for(Transaction::class)
                    ->with('category', 'merchant')
                    ->allowedFields(['name', 'note', 'type', 'base_amount', 'base_currency', 'currency_rate', 'amount', 'currency', 'is_recurring', 'is_manual', 'dated_at', 'public_id', 'category.public_id', 'category.name', 'category.slug', 'category.color', 'merchant.name', 'merchant.icon'])
                    ->allowedIncludes(includes: ['category', 'merchant'])
                    ->allowedFilters(['name', 'type', AllowedFilter::custom('account_id', new FiltersTransactionsByAccount)])
                    ->allowedSorts(sorts: 'dated_at')
                    ->defaultSort(sorts: '-dated_at')
                    ->paginate(perPage: $perPage)
                    ->onEachSide(1)
                    ->appends($request->query())
            ),
            'transaction' => $transaction,
            'categories' => $categories,
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }

    /**
     * Show the form for creating a new transaction.
     */
    public function create(Request $request): RedirectResponse|Response
    {
        if (! Gate::forUser($request->user())->check('create', Transaction::class)) {
            return to_route('transactions.index')
                ->with('toast', [
                    'title' => 'You are not allowed to create a transaction',
                    'type' => 'error',
                ]);
        }

        $accounts = AccountResource::collection(
            Account::query()->with('bankConnection')->latest()->get()
        );

        return Inertia::render('transactions/create/page', [
            'accounts' => $accounts,
            'currencies' => Forex::getSupportedCurrencies(),
            'categories' => CategoryResource::collection(
                Category::query()
                    ->where('is_system', true)
                    ->orWhere(function ($query): void {
                        $query->where('workspace_id', auth()->user()->current_workspace_id)
                            ->where('is_system', false);
                    })
                    ->orderBy('name', 'asc')
                    ->get()
            ),
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

        return to_route('transactions.index')
            ->with('toast', [
                'title' => 'Transaction deleted successfully',
                'type' => 'success',
            ]);
    }
}
