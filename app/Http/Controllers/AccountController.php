<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BankAccounts\CreateAccount;
use App\Actions\BankAccounts\CreateBankConnection;
use App\Data\Finance\AccountCreateData;
use App\Data\Finance\BankConnectionCreateData;
use App\Enums\Banking\ProviderType;
use App\Facades\Forex;
use App\Http\Requests\BankConnectionRequest;
use App\Http\Requests\CreateAccountRequest;
use App\Models\Account;
use App\Services\MeilisearchService;
use App\Services\TellerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
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
     * Create an account of a specific type
     */
    public function createAccountByType(Request $request, MeilisearchService $meilisearchService, string $connectionType): RedirectResponse|Response
    {
        if (! Gate::forUser($request->user())->check('create', Account::class)) {
            return to_route('accounts.index');
        }

        $data = [];

        if ($connectionType === 'manual') {
            $data['currencies'] = Forex::getSupportedCurrencies();
        }

        /** @var array{q: ?string, enrollment_id: ?string, provider: ?ProviderType, token: ?string} $validated */
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'enrollment_id' => ['sometimes', 'string'],
            'provider' => ['sometimes', Rule::enum(ProviderType::class)],
            'token' => ['sometimes', 'string'],
        ]);

        if ($connectionType === 'connect') {
            $query = $validated['q'] ?? '';
            $data['institutions'] = $meilisearchService->search('institutions', $query, [
                'limit' => 48,
            ]);

            if (isset($validated['enrollment_id']) && isset($validated['provider']) && isset($validated['token'])) {
                $teller = new TellerService($validated['token']);
                $data['bankAccounts'] = Inertia::defer(fn (): array => $teller->getAccounts()->toArray());
            }
        }

        return Inertia::render("accounts/create/{$connectionType}/page", $data);
    }

    /**
     * Handle form submission for the bank accounts selection step
     */
    public function storeBankConnections(BankConnectionRequest $request, CreateBankConnection $action): RedirectResponse
    {
        $action->create(BankConnectionCreateData::from($request->validated()));

        return redirect(route('accounts.index'))
            ->with('toast',
                [
                    'type' => 'success',
                    'title' => __('Great! You have connected your bank accounts.'),
                    'description' => __('We are syncing them now. This may take a few minutes.'),
                    'duration' => 10000,
                ]
            );
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
