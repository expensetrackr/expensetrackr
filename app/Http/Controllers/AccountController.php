<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\CurrencyService;
use App\Services\MeilisearchService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    public function create(): Response
    {
        $this->authorize('create', Account::class);

        return Inertia::render('accounts/create/page');
    }

    /**
     * Create an account of a specific type
     */
    public function createAccountByType(Request $request, CurrencyService $currencyService, MeilisearchService $meilisearchService, string $connectionType): Response
    {
        $this->authorize('create', Account::class);

        $data = [];

        if ($connectionType === 'manual') {
            $data['currencies'] = $currencyService->getSupportedCurrencies();
        }

        /** @var array{q: ?string} $validated */
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
        ]);

        if ($connectionType === 'connect') {
            $query = $validated['q'] ?? '';
            $data['institutions'] = $meilisearchService->search('institutions', $query, [
                'limit' => 48,
            ]);
        }

        return Inertia::render("accounts/create/{$connectionType}/page", $data);
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
