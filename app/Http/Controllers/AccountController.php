<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\AccountType;
use App\Http\Requests\StoreAccountStepRequest;
use App\Models\Account;
use App\Services\AccountWizardService;
use App\Services\CurrencyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Workspaces\Workspaces;

final class AccountController extends Controller
{
    /**
     * Create a new instance of the Account controller.
     */
    public function __construct(
        private readonly AccountWizardService $wizardService,
    ) {}

    /**
     * Display all accounts.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Account::class);

        return Workspaces::inertia()->render($request, 'accounts/index');
    }

    /**
     * Create a new account.
     */
    public function create(Request $request, CurrencyService $currencyService): Response|RedirectResponse
    {
        Gate::authorize('create', Account::class);

        $currentStep = $request->query('step');

        // If no step or invalid step provided, redirect to details
        if (! $currentStep || ! in_array($currentStep, AccountWizardService::STEPS)) {
            return redirect()->route('accounts.create', ['step' => 'details']);
        }

        $steps = [
            'details' => [
                'component' => 'accounts/create/index',
                'props' => [
                    'accountTypes' => AccountType::array(),
                ],
            ],
            'balance-and-currency' => [
                'component' => 'accounts/create/balance-and-currency',
                'props' => [
                    'previousData' => $this->wizardService->getStepData($request, 'details'),
                    'currencies' => $currencyService->getSupportedCurrencies(),
                ],
            ],
            'review' => [
                'component' => 'accounts/create/review',
                'props' => [
                    'step1Data' => $this->wizardService->getStepData($request, 'details'),
                    'step2Data' => $this->wizardService->getStepData($request, 'balance-and-currency'),
                ],
            ],
        ];

        // Validate step progression
        $currentStepIndex = array_search($currentStep, AccountWizardService::STEPS);
        for ($i = 0; $i < $currentStepIndex; $i++) {
            $previousStep = AccountWizardService::STEPS[$i];
            if ($this->wizardService->getStepData($request, $previousStep) === []) {
                return redirect()->route('accounts.create', ['step' => $previousStep]);
            }
        }

        assert(is_string($currentStep));
        $currentStepData = $steps[$currentStep];

        return Workspaces::inertia()->render(
            $request,
            $currentStepData['component'],
            [
                'currentStep' => $currentStep,
                'totalSteps' => count($steps),
                'completedSteps' => array_filter([
                    'details' => $this->wizardService->getStepData($request, 'details'),
                    'balance-and-currency' => $this->wizardService->getStepData($request, 'balance-and-currency'),
                    'review' => false, // Review is never completed as it's the final step
                ]),
                ...$currentStepData['props'],
            ]
        );
    }

    /**
     * Handle form submission for each step
     */
    public function store(StoreAccountStepRequest $request, string $step): RedirectResponse
    {
        $validated = $request->validated();
        $this->wizardService->storeStepData($request, $step, $validated);

        if ($step === 'review') {
            /** @var array<string, string|array<string>> $step1Data */
            $step1Data = $this->wizardService->getStepData($request, 'details');
            /** @var array<string, string|array<string>> $step2Data */
            $step2Data = $this->wizardService->getStepData($request, 'balance-and-currency');

            $accountData = [
                ...$step1Data,
                ...$step2Data,
                ...$validated,
            ];

            $account = new Account();
            $account->fill($accountData);
            $account->save();

            $this->wizardService->clearWizardData($request);

            return redirect()->route('accounts.show', $account)
                ->with('success', 'Account created successfully.');
        }

        $nextStep = match ($step) {
            'details' => 'balance-and-currency',
            'balance-and-currency' => 'review',
            default => abort(404)
        };

        return redirect()->route('accounts.create', ['step' => $nextStep]);
    }
}
