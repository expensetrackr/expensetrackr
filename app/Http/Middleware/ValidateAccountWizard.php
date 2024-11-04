<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class ValidateAccountWizard
{
    public function handle(Request $request, Closure $next): Response
    {
        $currentStep = (int) $request->query('step', 1);

        // Step 1 is always accessible
        if ($currentStep === 1) {
            return $next($request);
        }

        // Check if previous steps are completed
        for ($i = 1; $i < $currentStep; $i++) {
            if (! $request->session()->has("account_wizard.step{$i}")) {
                return redirect()->route('accounts.create', ['step' => $i])
                    ->with('error', 'Please complete the previous steps first.');
            }
        }

        return $next($request);
    }
}
