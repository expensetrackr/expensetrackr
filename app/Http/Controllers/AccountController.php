<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\BankAccounts\CreateAccount;
use App\Actions\BankAccounts\CreateBankConnection;
use App\Data\Banking\Account\CreateAccountData;
use App\Data\Banking\Connection\CreateBankConnectionData;
use App\Enums\ProviderType;
use App\Facades\Forex;
use App\Http\Requests\BankConnectionRequest;
use App\Http\Requests\CreateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Services\MeilisearchService;
use App\Services\TellerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

final class AccountController
{
    use AuthorizesRequests;

    /**
     * Display all accounts.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Account::class);

        $accountPublicId = $request->query('account_id');

        $accounts = AccountResource::collection(QueryBuilder::for(Account::class)
            ->with('bankConnection')
            ->allowedFilters(['name'])
            ->allowedSorts(sorts: 'created_at')
            ->defaultSort('-created_at')
            ->tap(function ($builder) use ($request) {
                if (filled($request->search)) {
                    return $builder->whereIn('id', Account::search($request->search)->get()->pluck('id'));
                }
            })
            ->paginate(100)
            ->appends($request->query()));

        $account = null;
        if ($accountPublicId) {
            $account = Account::with(
                [
                    'bankConnection',
                    'transactions' => function (Builder $query): void {
                        $query
                            ->orderBy('dated_at', 'desc')
                            ->select('name', 'note', 'base_amount', 'base_currency', 'currency_rate', 'amount', 'currency', 'dated_at', 'account_id', 'category_id', 'merchant_id', 'public_id')
                            ->with([
                                'category' => function (Builder $query): void {
                                    $query->select('id', 'name', 'slug', 'color', 'public_id');
                                },
                                'merchant' => function (Builder $query): void {
                                    $query->select('id', 'name', 'icon');
                                },
                            ])
                            ->limit(3);
                    },
                ]
            )
                ->wherePublicId($accountPublicId)
                ->firstOrFail();
            $account = new AccountResource($account);
        }

        return Inertia::render('accounts/page', [
            'query' => $request->query(),
            'accounts' => $accounts,
            'account' => $account,
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
    public function createAccountByType(Request $request, MeilisearchService $meilisearchService, string $connectionType): Response
    {
        $this->authorize('create', Account::class);

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
        $action->create(CreateBankConnectionData::from($request->validated()));

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
        $action->create(CreateAccountData::from([
            ...$request->validated(),
            'isDefault' => false,
        ]));

        return redirect()->route('accounts.index')
            ->with('toast',
                [
                    'type' => 'success',
                    'title' => __('Account created successfully'),
                ]
            );
    }
}
