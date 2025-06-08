<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Transactions\CreateTransaction;
use App\Actions\Transactions\UpdateTransaction;
use App\Filters\FiltersTransactionsByAccount;
use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
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

        return Inertia::render('transactions/page', [
            'transactions' => QueryBuilder::for(Transaction::class)
                ->allowedFilters(['name', 'type', AllowedFilter::custom('account_id', new FiltersTransactionsByAccount)])
                ->allowedSorts(['dated_at', '-dated_at'])
                ->defaultSort('-dated_at')
                ->with(['category', 'merchant'])
                ->paginate($perPage)
                ->onEachSide(1)
                ->appends(request()->query())
                ->toResourceCollection(),
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

        return to_route('transactions.index')
            ->with('toast', [
                'title' => 'Transaction deleted successfully',
                'type' => 'success',
            ]);
    }
}
