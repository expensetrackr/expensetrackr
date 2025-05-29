<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BankAccounts\CreateAccount;
use App\Http\Requests\CreateAccountRequest;
use App\Models\Account;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

final class AccountController extends Controller
{
    /**
     * Display all accounts.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('accounts/page', [
            'query' => $request->query(),
            'accounts' => QueryBuilder::for(Account::class)
                ->allowedFilters(['name'])
                ->allowedSorts(['created_at', '-created_at'])
                ->defaultSort('-created_at')
                ->with(['bankConnection'])
                ->paginate(100)
                ->withQueryString()
                ->toResourceCollection(),
        ]);
    }

    /**
     * Handle form submission for each step
     *
     * @throws AuthorizationException
     */
    public function store(CreateAccountRequest $request, CreateAccount $action): RedirectResponse
    {
        $action->create($request->validated());

        return redirect()->route('accounts.index')
            ->with('toast',
                [
                    'type' => 'success',
                    'title' => __('accounts.created.success'),
                ]
            );
    }

    /**
     * Delete an account
     */
    public function destroy(Request $request, Account $account): RedirectResponse
    {
        if (! Gate::forUser($request->user())->check('delete', $account)) {
            return back()
                ->with('toast', [
                    'title' => 'You are not allowed to delete this account',
                    'type' => 'error',
                ]);
        }

        $account->delete();

        return redirect()->route('accounts.index')
            ->with('toast', [
                'type' => 'success',
                'title' => __('accounts.deleted.success'),
            ]);
    }
}
