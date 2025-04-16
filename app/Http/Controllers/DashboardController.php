<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Services\BalanceSheet;
use App\ValueObjects\Period;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Database\Eloquent\Builder;
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

        $query = type($request->query('q', ''))->asString();

        return Inertia::render('dashboard', [
            'netWorth' => $balanceSheet->netWorth(),
            'series' => [
                'lastWeek' => $balanceSheet->netWorthSeries(Period::lastWeek(), 'day'),
                'lastMonth' => $balanceSheet->netWorthSeries(Period::lastMonth(), 'day'),
                'lastYear' => $balanceSheet->netWorthSeries(Period::lastYear(), 'month'),
            ],
            'transactions' => Transaction::search($query)
                ->query(function (Builder $query) {
                    $query->with('category');
                })
                ->take(5)->get()->toResourceCollection(),
            // Handy for updating the table when anything from server side changes
            'requestId' => Str::uuid(),
        ]);
    }
}
