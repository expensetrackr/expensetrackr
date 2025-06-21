<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Password\UpdatePassword;
use App\Actions\TwoFactorAuth\DisableTwoFactorAuthentication;
use App\Actions\TwoFactorAuth\GenerateNewRecoveryCodes;
use App\Actions\TwoFactorAuth\GenerateQrCodeAndSecretKey;
use App\Actions\TwoFactorAuth\VerifyTwoFactorCode;
use App\Data\Auth\SessionData;
use App\Http\Requests\UpdatePasswordRequest;
use Cjmellor\BrowserSessions\Facades\BrowserSessions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PrivacyAndSecurityController extends Controller
{
    /**
     * Show the general profile settings screen.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $confirmed = $user->two_factor_confirmed_at !== null;

        // If 2fa is not confirmed, we want to clear out secret and recovery codes
        // This happens when a user enables 2fa and does not finish confirmation
        if (! $confirmed) {
            app(DisableTwoFactorAuthentication::class)($user);
        }

        return Inertia::render('settings/privacy-and-security/show', [
            'confirmsTwoFactorAuthentication' => $confirmed,
            'sessions' => SessionData::collect(BrowserSessions::sessions()),
            'recoveryCodes' => $user->two_factor_secret !== null && $user->two_factor_recovery_codes !== null ? json_decode(decrypt($user->two_factor_recovery_codes)) : [],
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request, UpdatePassword $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated());

        return back();
    }

    /**
     * Enable two factor authentication
     * route[POST] => 'settings/privacy-and-security/two-factor'
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function enableTwoFactorAuthentication(Request $request)
    {
        [$qrCode, $secret] = app(GenerateQrCodeAndSecretKey::class)($request->user());

        $request->user()->forceFill([
            'two_factor_secret' => encrypt($secret),
        ])->save();

        return response()->json([
            'qrCode' => $qrCode,
            'secret' => $secret,
        ]);
    }

    /**
     * Verify and confirm the user's two-factor authentication.
     * route[POST] => 'settings/privacy-and-security/two-factor/confirm'
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmTwoFactorAuthentication(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        // Get the secret key from the user's record
        $secret = decrypt($request->user()->two_factor_secret);

        // Verify the code
        $valid = app(VerifyTwoFactorCode::class)($secret, $request->code);

        if ($valid) {
            // Generate recovery codes when confirming 2FA
            $recoveryCodes = app(GenerateNewRecoveryCodes::class)($request->user());

            // Update user with recovery codes and confirm 2FA
            $request->user()->forceFill([
                'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
                'two_factor_confirmed_at' => now(),
            ])->save();

            return response()->json([
                'status' => 'two-factor-authentication-confirmed',
                'recovery_codes' => $recoveryCodes,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'The provided two-factor authentication code was invalid.',
        ], 422);
    }

    /**
     * Generate new recovery codes for the user.
     * route[POST] => 'settings/privacy-and-security/two-factor/recovery-codes'
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        $codes = app(GenerateNewRecoveryCodes::class)($request->user());

        $request->user()->forceFill([
            'two_factor_recovery_codes' => encrypt(json_encode($codes)),
        ])->save();

        return response()->json([
            'recovery_codes' => $codes,
        ]);
    }

    /**
     * Disable two factor authentication for the user.
     * route[DELETE] => 'settings/privacy-and-security/two-factor'
     *
     * @return void
     */
    public function disableTwoFactorAuthentication(Request $request)
    {
        $disableTwoFactorAuthentication = app(DisableTwoFactorAuthentication::class);
        $disableTwoFactorAuthentication($request->user());
    }
}
