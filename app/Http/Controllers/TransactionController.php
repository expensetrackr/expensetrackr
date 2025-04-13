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
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
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
        $transactionId = $request->string('transaction_id');

        $transaction = $transactionId->isNotEmpty()
            ? Transaction::query()
                ->with(['category', 'merchant'])
                ->wherePublicId($transactionId->value())
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
                ->allowedIncludes(includes: ['category', 'merchant'])
                ->allowedFilters(['name', 'type', AllowedFilter::custom('account_id', new FiltersTransactionsByAccount)])
                ->allowedSorts(sorts: 'dated_at')
                ->defaultSort(sorts: '-dated_at')
                ->with(['category', 'merchant'])
                ->paginate(perPage: $perPage)
                ->onEachSide(1)
                ->appends($request->query())
                ->toResourceCollection(),
            'transaction' => $transaction,
            'categories' => $categories,
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }

    /**
     * Show the form for creating a new transaction.
     */
    public function create(Request $request, #[CurrentUser] User $user): RedirectResponse|Response
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
            'categories' => Category::query()
                ->where('is_system', true)
                ->orWhere(function ($query) use ($user): void {
                    $query->where('workspace_id', $user->current_workspace_id)
                        ->where('is_system', false);
                })
                ->oldest('name')
                ->get()
                ->toResourceCollection(),
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
