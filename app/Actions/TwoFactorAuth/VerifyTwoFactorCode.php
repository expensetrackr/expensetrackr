<?php

declare(strict_types=1);

namespace App\Actions\TwoFactorAuth;

use Exception;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FA\Google2FA;

final class VerifyTwoFactorCode
{
    /**
     * Verify a two-factor authentication code.
     *
     * @param  string  $secret  The decrypted secret key
     * @param  string  $code  The code to verify
     */
    public function __invoke(string $secret, string $code): bool
    {
        if (empty($secret) || empty($code)) {
            return false;
        }

        // Clean the code (remove spaces and non-numeric characters)
        $code = preg_replace('/[^0-9]/', '', $code);

        // Create a new Google2FA instance with explicit configuration
        $google2fa = new Google2FA();
        $google2fa->setWindow(8); // Allow for ±4 intervals (2 minutes) to handle clock drift and user input delays
        $google2fa->setOneTimePasswordLength(6); // Ensure 6-digit codes

        try {
            return $google2fa->verify($code, $secret);
        } catch (Exception $e) {
            Log::warning('2FA verification failed', ['error' => $e->getMessage()]);

            return false;
        }
    }
}
