<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BankAccounts\CreateAccount;
use App\Data\Finance\AccountCreateData;
use App\Http\Requests\CreateAccountRequest;
use App\Models\Account;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Meilisearch\Endpoints\Indexes;

final class AccountController extends Controller
{
    /**
     * Display all accounts.
     */
    public function index(Request $request): Response
    {
        $searchQuery = type($request->query('q', ''))->asString();
        /** @var array<string, string> */
        $filters = type($request->query('filters', [
            'sort' => 'created_at',
            'sort_direction' => 'desc',
        ]))->asArray();
        $accountPublicId = $request->query('account_id');

        $account = null;
        if ($accountPublicId) {
            $account = Account::with(
                [
                    'bankConnection',
                    'transactions' => function (Builder $query): void {
                        $query
                            ->latest('dated_at')
                            ->with('category')
                            ->limit(3);
                    },
                ]
            )
                ->wherePublicId($accountPublicId)
                ->firstOrFail()
                ->toResource();
        }

        return Inertia::render('accounts/page', [
            'query' => $request->query(),
            'accounts' => Account::search(
                $searchQuery,
                function (Indexes $meiliSearch, string $query, array $options) use ($filters) {
                    // if sort and sort_direction are not empty, add them to the options
                    if (! empty($filters['sort']) && (isset($filters['sort_direction']) && ($filters['sort_direction'] !== '' && $filters['sort_direction'] !== '0'))) {
                        $options['sort'] = [$filters['sort'].':'.$filters['sort_direction']];
                    }

                    return $meiliSearch->search($query, $options);
                })
                ->query(function (Builder $query): void {
                    $query->with(['bankConnection']);
                })
                ->paginate(100)
                ->withQueryString()
                ->toResourceCollection(),
            'account' => $account,
        ]);
    }

    /**
     * Create a new account
     */
    public function create(Request $request): RedirectResponse|Response
    {
        if (! Gate::forUser($request->user())->check('create', Account::class)) {
            return to_route('accounts.index');
        }

        return Inertia::render('accounts/create/page');
    }

    /**
     * Handle form submission for each step
     *
     * @throws AuthorizationException
     */
    public function store(CreateAccountRequest $request, CreateAccount $action): RedirectResponse
    {
        $action->create(AccountCreateData::from([
            ...$request->validated(),
            'isDefault' => false,
        ]));

        return redirect()->route('accounts.index')
            ->with('toast',
                [
                    'type' => 'success',
                    'title' => __('accounts.created'),
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
                'title' => __('accounts.deleted'),
            ]);
    }
}
