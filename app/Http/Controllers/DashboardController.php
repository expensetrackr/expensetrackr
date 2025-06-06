<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Finance\TransactionType;
use App\Models\Transaction;
use App\Models\User;
use App\Services\BalanceSheet;
use App\ValueObjects\Period;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request, #[CurrentUser] User $user): Response|RedirectResponse
    {
        if (! $user->currentWorkspace) {
            return to_route('dashboard')
                ->with('toast', [
                    'title' => 'No workspace selected',
                    'type' => 'error',
                ]);
        }

        $balanceSheet = new BalanceSheet($user->currentWorkspace);

        $request->query('q', '');

        /** @var array{period: string} */
        $totalBalancePeriod = $request->query('total_balance', [
            'period' => 'last-month',
        ]);
        $totalBalanceParams = match ($totalBalancePeriod['period']) {
            'last-month' => ['period' => Period::lastMonth(), 'interval' => 'day'],
            'last-6-months' => ['period' => Period::last6Months(), 'interval' => 'month'],
            'last-year' => ['period' => Period::lastYear(), 'interval' => 'month'],
            default => ['period' => Period::lastMonth(), 'interval' => 'day'],
        };

        /** @var array{period: string} */
        $spendingByCategoryPeriod = $request->query('spending_by_category', [
            'period' => 'last-month',
        ]);
        $spendingByCategoryParams = match ($spendingByCategoryPeriod['period']) {
            'last-month' => Period::lastMonth(),
            'last-6-months' => Period::last6Months(),
            'last-year' => Period::lastYear(),
            default => Period::lastMonth(),
        };

        // Get spending by category for the selected period (expenses only)
        $transactions = $user->currentWorkspace
            ->transactions()
            ->with('category')
            ->where('type', TransactionType::Expense)
            ->where('dated_at', '>=', $spendingByCategoryParams->startDate)
            ->where('dated_at', '<=', $spendingByCategoryParams->endDate)
            ->get();

        $grouped = $transactions->groupBy('category.name');
        $totalSpending = abs($transactions->sum('amount'));

        $spendingByCategory = $grouped
            ->map(function ($categoryTransactions, $categoryName) use ($totalSpending) {
                $categoryTotal = abs($categoryTransactions->sum('amount'));

                return [
                    'id' => $categoryTransactions->first()?->category?->slug ?? Str::slug($categoryName ?? 'uncategorized'),
                    'name' => $categoryName ?? 'Uncategorized',
                    'value' => $categoryTotal,
                    'color' => $categoryTransactions->first()?->category?->color ?? '#8B5CF6',
                    'percentage' => $totalSpending > 0
                        ? round(($categoryTotal / $totalSpending) * 100, 1)
                        : 0,
                ];
            })
            ->sortByDesc('percentage')
            ->values()
            ->toArray();

        return Inertia::render('dashboard', [
            'netWorth' => $balanceSheet->netWorth(),
            'series' => [
                'totalBalance' => $balanceSheet->netWorthSeries($totalBalanceParams['period'], $totalBalanceParams['interval']),
            ],
            'spendingByCategory' => $spendingByCategory,
            'transactions' => Transaction::with(['category', 'merchant'])
                ->latest('dated_at')
                ->take(5)
                ->get()
                ->toResourceCollection(),
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }
}
