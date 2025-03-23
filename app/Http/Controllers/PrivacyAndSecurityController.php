<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Concerns\ConfirmsTwoFactorAuthentication;
use App\Data\Auth\SessionData;
use Cjmellor\BrowserSessions\Facades\BrowserSessions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

final class PrivacyAndSecurityController
{
    use ConfirmsTwoFactorAuthentication;

    /**
     * Show the general profile settings screen.
     */
    public function show(Request $request): Response
    {
        $this->validateTwoFactorAuthenticationState($request);

        return Inertia::render('settings/privacy-and-security/show', [
            'confirmsTwoFactorAuthentication' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            'sessions' => SessionData::collect(BrowserSessions::sessions()),
        ]);
    }
}
