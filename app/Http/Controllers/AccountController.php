<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\AccountType;
use App\Models\Account;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Response;
use Workspaces\Workspaces;

final class AccountController extends Controller
{
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
    public function create(Request $request): Response|RedirectResponse
    {
        Gate::authorize('create', Account::class);

        // Get current step from query param, default to details
        $currentStep = $request->query('step', 'details') ?: 'details';

        // Define wizard steps and their data
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
                    // Get step 1 data from session to show in review
                    'previousData' => $request->session()->get('account_wizard.step1'),
                ],
            ],
            'review' => [
                'component' => 'accounts/create/review',
                'props' => [
                    // Get all previous steps data for review
                    'step1Data' => $request->session()->get('account_wizard.step1'),
                    'step2Data' => $request->session()->get('account_wizard.step2'),
                ],
            ],
        ];

        // Validate requested step
        if (! array_key_exists($currentStep, $steps)) {
            return redirect()->route('accounts.create', ['step' => 'details']);
        }

        $currentStepData = $steps[$currentStep];

        return Workspaces::inertia()->render(
            $request,
            $currentStepData['component'],
            [
                'currentStep' => $currentStep,
                'totalSteps' => count($steps),
                'completedSteps' => array_filter([
                    1 => $request->session()->has('account_wizard.step1'),
                    2 => $request->session()->has('account_wizard.step2'),
                    3 => false, // Step 3 is never completed as it's the final step
                ]),
                ...$currentStepData['props'],
            ]
        );
    }

    /**
     * Handle form submission for each step
     */
    public function store(Request $request, int $step): RedirectResponse
    {
        Gate::authorize('create', Account::class);

        // Validate based on current step
        $validated = match ($step) {
            1 => $request->validate([
                'name' => ['required', 'string', 'min:3', 'max:255'],
                'description' => ['nullable', 'string', 'max:1000'],
                'type' => ['required', 'string', Rule::enum(AccountType::class)],
            ]),
            2 => $request->validate([]),
            3 => $request->validate([]),
            default => abort(404)
        };

        // Store step data in session with expiration
        $request->session()->put("account_wizard.step{$step}", [
            'data' => $validated,
            'timestamp' => now(),
        ]);

        // Check for expired steps (e.g., older than 30 minutes)
        $this->clearExpiredSteps($request);

        // If final step, create account
        if ($step === 3) {
            $accountData = [
                ...$request->session()->get('account_wizard.step1', []),
                ...$request->session()->get('account_wizard.step2', []),
                ...$validated,
            ];

            // Create account
            $account = Account::create($accountData);

            // Clear wizard data from session
            $request->session()->forget(['account_wizard']);

            return redirect()->route('accounts.show', $account)
                ->with('success', 'Account created successfully.');
        }

        // Proceed to next step
        return redirect()->route('accounts.create', ['step' => $step + 1]);
    }

    private function clearExpiredSteps(Request $request): void
    {
        $expirationTime = now()->subMinutes(30);

        foreach (range(1, 3) as $step) {
            $stepData = $request->session()->get("account_wizard.step{$step}");
            if ($stepData && $stepData['timestamp'] < $expirationTime) {
                $request->session()->forget("account_wizard.step{$step}");
            }
        }
    }
}
