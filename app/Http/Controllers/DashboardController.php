<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\BalanceSheet;
use App\ValueObjects\Period;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(#[CurrentUser] User $user): Response|RedirectResponse
    {
        if (! $user->currentWorkspace) {
            return to_route('dashboard')
                ->with('toast', [
                    'title' => 'No workspace selected',
                    'type' => 'error',
                ]);
        }

        $balanceSheet = new BalanceSheet($user->currentWorkspace);

        return Inertia::render('dashboard', [
            'netWorth' => $balanceSheet->netWorth(),
            'series' => [
                'lastWeek' => $balanceSheet->netWorthSeries(Period::lastWeek(), 'day'),
                'lastMonth' => $balanceSheet->netWorthSeries(Period::lastMonth(), 'day'),
                'lastYear' => $balanceSheet->netWorthSeries(Period::lastYear(), 'month'),
            ],
            'transactions' => $user->currentWorkspace->transactions()->with('category')->latest()->take(5)->get()->toResourceCollection(),
        ]);
    }
}
