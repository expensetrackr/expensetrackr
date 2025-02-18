<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\CurrencyService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class AccountController
{
    use AuthorizesRequests;

    /**
     * Display all accounts.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Account::class);

        return Inertia::render('accounts/index', [
            'accounts' => Account::all()->sortBy('name'),
        ]);
    }

    /**
     * Create a new account
     */
    public function create(CurrencyService $currencyService): Response
    {
        $this->authorize('create', Account::class);

        return Inertia::render('accounts/create/index', [
            'currencies' => $currencyService->getSupportedCurrencies(),
        ]);
    }

    /**
     * Handle form submission for each step
     *
     * @throws AuthorizationException
     */
    public function store(): RedirectResponse
    {
        return redirect()->route('accounts.create');
    }
}
