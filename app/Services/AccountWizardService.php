<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Request;

final class AccountWizardService
{
    public const STEPS = [
        'details',
        'balance-and-currency',
        'review',
    ];

    private const EXPIRATION_MINUTES = 30;

    public function getStepData(Request $request, string $step): mixed
    {
        return $request->session()->get("account_wizard.{$step}", []);
    }

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

    private function clearExpiredSteps(Request $request): void
    {
        $expirationTime = now()->subMinutes(self::EXPIRATION_MINUTES);

        foreach (self::STEPS as $step) {
            /** @var array<string, string> $stepData */
            $stepData = $request->session()->get("account_wizard.{$step}");
            if ($stepData && $stepData['timestamp'] < $expirationTime) {
                $request->session()->forget("account_wizard.{$step}");
            }
        }
    }
}
