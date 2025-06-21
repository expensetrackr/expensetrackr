<?php

declare(strict_types=1);

namespace App\Actions\TwoFactorAuth;

final class ProcessRecoveryCode
{
    /**
     * Verify a recovery code and remove it from the list if valid.
     *
     * @param  array  $recoveryCodes  The array of recovery codes
     * @param  string  $submittedCode  The code submitted by the user
     * @return array|false Returns the updated array of recovery codes if valid, or false if invalid
     */
    public function __invoke(array $recoveryCodes, string $submittedCode)
    {
        // Clean the submitted code
        $submittedCode = trim($submittedCode);

        // Check if the code is valid using a timing-safe comparison
        $valid = false;
        foreach ($recoveryCodes as $code) {
            if (hash_equals($code, $submittedCode)) {
                $valid = true;
                break;
            }
        }

        if (! $valid) {
            return false;
        }

        // Remove the used recovery code from the list
        $updatedCodes = array_values(array_filter($recoveryCodes, function ($code) use ($submittedCode) {
            return ! hash_equals($code, $submittedCode);
        }));

        return $updatedCodes;
    }
}
