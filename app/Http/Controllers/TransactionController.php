<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
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

        return Inertia::render('transactions/page', [
            'transactions' => TransactionResource::collection(
                QueryBuilder::for(Transaction::class)
                    ->with('category', 'enrichment')
                    ->allowedFields(['name', 'note', 'type', 'base_amount', 'base_currency', 'currency_rate', 'amount', 'currency', 'is_recurring', 'is_manual', 'dated_at', 'public_id', 'category.public_id', 'category.name', 'category.slug', 'category.color', 'enrichment.merchant_name', 'enrichment.icon'])
                    ->allowedIncludes(includes: ['category', 'enrichment'])
                    ->allowedFilters(['name', 'type'])
                    ->allowedSorts(sorts: 'dated_at')
                    ->defaultSort(sorts: '-dated_at')
                    ->paginate($perPage)
                    ->appends($request->query())
            ),
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }
}
