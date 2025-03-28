<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\BalanceSheet;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController
{
    public function __invoke(): Response
    {
        $balanceSheet = new BalanceSheet(auth()->user()->currentWorkspace);

        return Inertia::render('dashboard', [
            'netWorth' => $balanceSheet->netWorth(),
        ]);
    }
}
