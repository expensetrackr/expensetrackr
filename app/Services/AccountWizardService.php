<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AccountType;
use App\Models\Account;
use Illuminate\Http\Request;
use InvalidArgumentException;

final class AccountWizardService
{
    public const string STEP_DETAILS = 'details';

    public const string STEP_BALANCE_CURRENCY = 'balance-and-currency';

    public const string STEP_REVIEW = 'review';

    public const array STEPS = [
        self::STEP_DETAILS,
        self::STEP_BALANCE_CURRENCY,
        self::STEP_REVIEW,
    ];

    private const int EXPIRATION_MINUTES = 30;

    /**
     * @param  array<string, mixed>  $data
     */
    public function storeStepData(Request $request, string $step, array $data): void
    {
        $request->session()->put("account_wizard.{$step}", [
            ...$data,
            'timestamp' => now(),
        ]);
        $this->clearExpiredSteps($request);
    }

    public function clearWizardData(Request $request): void
    {
        $request->session()->forget(['account_wizard']);
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function getAllStepsData(Request $request): array
    {
        $data = [];
        foreach (self::STEPS as $step) {
            $stepData = $this->getStepData($request, $step);
            if ($stepData !== []) {
                $data[$step] = $stepData;
            }
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    public function getStepData(Request $request, string $step): array
    {
        /** @var array<string, mixed> */
        return $request->session()->get("account_wizard.{$step}", []);
    }

    public function validateStep(string $step): string
    {
        if ($step === '' || $step === '0' || ! in_array($step, self::STEPS, true)) {
            throw new InvalidArgumentException('Invalid step provided.');
        }

        return $step;
    }

    public function validateStepProgression(Request $request, string $currentStep): void
    {
        $currentStepIndex = array_search($currentStep, self::STEPS, true);
        if ($currentStepIndex === false) {
            throw new InvalidArgumentException('Invalid step.');
        }

        for ($i = 0; $i < $currentStepIndex; $i++) {
            $previousStep = self::STEPS[$i];
            if ($this->getStepData($request, $previousStep) === []) {
                throw new InvalidArgumentException("Please complete the {$previousStep} step first.");
            }
        }
    }

    public function getFirstIncompleteStep(Request $request): string
    {
        foreach (self::STEPS as $step) {
            if ($this->getStepData($request, $step) === []) {
                return $step;
            }
        }

        return self::STEP_REVIEW;
    }

    public function getNextStep(string $currentStep): string
    {
        $currentIndex = array_search($currentStep, self::STEPS, true);
        if ($currentIndex === false || $currentIndex >= count(self::STEPS) - 1) {
            throw new InvalidArgumentException('Invalid or final step.');
        }

        return self::STEPS[$currentIndex + 1];
    }

    public function getTotalSteps(): int
    {
        return count(self::STEPS);
    }

    /**
     * Get all wizard data for completed steps without timestamps
     *
     * @return array<string, mixed>
     */
    public function getWizardData(Request $request): array
    {
        $wizardData = [];

        foreach (self::STEPS as $step) {
            $stepData = $this->getStepData($request, $step);
            if ($stepData !== []) {
                // Remove the timestamp and merge data
                unset($stepData['timestamp']);
                $wizardData = array_merge($wizardData, $stepData);
            }
        }

        return $wizardData;
    }

    /**
     * @return array<string, bool>
     */
    public function getCompletedSteps(Request $request): array
    {
        $completed = [];

        foreach (self::STEPS as $step) {
            $stepData = $this->getStepData($request, $step);
            $completed[$step] = $stepData !== [];
        }

        // Review is never completed as it's the final step
        $completed[self::STEP_REVIEW] = false;

        return $completed;
    }

    /**
     * @param  array<string, array<string, mixed>>  $stepData
     * @param  array<string>|null  $currencies
     * @return array{component: string, props: array<string, mixed>}
     */
    public function getStepConfiguration(string $step, array $stepData, ?array $currencies): array
    {
        $formData = array_merge(...array_values($stepData));

        return match ($step) {
            self::STEP_DETAILS => [
                'component' => 'accounts/create/index',
                'props' => [
                    'accountTypes' => AccountType::array(),
                ],
            ],
            self::STEP_BALANCE_CURRENCY => [
                'component' => 'accounts/create/balance-and-currency',
                'props' => [
                    'formData' => $formData,
                    'currencies' => $currencies,
                ],
            ],
            self::STEP_REVIEW => [
                'component' => 'accounts/create/review',
                'props' => [
                    'formData' => $formData,
                ],
            ],
            default => throw new InvalidArgumentException('Invalid step configuration.'),
        };
    }

    public function createAccount(Request $request): Account
    {
        $step1Data = $this->getStepData($request, self::STEP_DETAILS);
        $step2Data = $this->getStepData($request, self::STEP_BALANCE_CURRENCY);

        if ($step1Data === [] || $step2Data === []) {
            throw new InvalidArgumentException('Missing required step data.');
        }

        $attributes = [
            ...$step1Data,
            ...$step2Data,
        ];

        unset($attributes['timestamp']);

        return Account::create($attributes);
    }

    private function clearExpiredSteps(Request $request): void
    {
        $expirationTime = now()->subMinutes(self::EXPIRATION_MINUTES);

        foreach (self::STEPS as $step) {
            /** @var array<string, mixed> $stepData */
            $stepData = $request->session()->get("account_wizard.{$step}");
            if ($stepData && $stepData['timestamp'] < $expirationTime) {
                $request->session()->forget("account_wizard.{$step}");
            }
        }
    }
}
