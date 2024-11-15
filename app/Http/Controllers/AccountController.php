<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountStepRequest;
use App\Models\Account;
use App\Services\AccountWizardService;
use App\Services\CurrencyService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use InvalidArgumentException;
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
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function create(Request $request, CurrencyService $currencyService): Response|RedirectResponse
    {
        Gate::authorize('create', Account::class);

        $currentStep = $request->query('step');

        if (empty($currentStep)) {
            return redirect()->route('accounts.create', ['step' => $this->wizardService->getFirstIncompleteStep($request)]);
        }

        try {
            $currentStep = $this->wizardService->validateStep(type($currentStep)->asString());
            $this->wizardService->validateStepProgression($request, $currentStep);
        } catch (InvalidArgumentException $e) {
            return redirect()->route('accounts.create', ['step' => $this->wizardService->getFirstIncompleteStep($request)])
                ->with('toast', ['type' => 'error', 'message' => $e->getMessage()]);
        }

        $stepData = $this->wizardService->getAllStepsData($request);
        $currentStepData = $this->wizardService->getStepConfiguration(
            $currentStep,
            $stepData,
            $currencyService->getSupportedCurrencies()
        );

        return Workspaces::inertia()->render(
            $request,
            $currentStepData['component'],
            [
                'wizard' => [
                    'currentStep' => $currentStep,
                    'totalSteps' => $this->wizardService->getTotalSteps(),
                    'completedSteps' => $this->wizardService->getCompletedSteps($request),
                    'data' => $this->wizardService->getWizardData($request),
                ],
                ...$currentStepData['props'],
            ]
        );
    }

    /**
     * Handle form submission for each step
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(StoreAccountStepRequest $request, string $step): RedirectResponse
    {
        Gate::authorize('create', Account::class);

        try {
            $this->wizardService->validateStep($step);
        } catch (InvalidArgumentException $e) {
            return redirect()->route('accounts.create', ['step' => 'details'])
                ->with('toast', ['type' => 'error', 'message' => $e->getMessage()]);
        }

        $validated = $request->validated();
        $this->wizardService->storeStepData($request, $step, $validated);

        if ($step === AccountWizardService::STEP_REVIEW) {
            try {
                $account = $this->wizardService->createAccount($request);
                $this->wizardService->clearWizardData($request);

                return redirect()->route('accounts.show', $account)
                    ->with('toast', ['type' => 'success', 'message' => 'Account created successfully.']);
            } catch (Exception) {
                return redirect()->back()
                    ->with('toast', ['type' => 'error', 'message' => 'Failed to create account. Please try again.']);
            }
        }

        try {
            $nextStep = $this->wizardService->getNextStep($step);

            return redirect()->route('accounts.create', ['step' => $nextStep]);
        } catch (InvalidArgumentException $e) {
            return redirect()->back()
                ->with('toast', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
