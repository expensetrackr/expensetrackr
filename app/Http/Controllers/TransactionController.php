<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Transactions\UpdateTransaction;
use App\Filters\FiltersTransactionsByAccount;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TransactionResource;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class TransactionController
{
    use AuthorizesRequests;

    /**
     * Display all transactions.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Transaction::class);

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
     * Update the given transaction.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction, UpdateTransaction $action)
    {
        $this->authorize('update', $transaction);

        $action->handle($transaction, $request->validated());

        return back(303);
    }
}
