<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Cjmellor\BrowserSessions\Facades\BrowserSessions;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Response;
use Laravel\Fortify\Features;
use Workspaces\Workspaces;

final class PrivacyAndSecurityController extends Controller
{
    use Concerns\ConfirmsTwoFactorAuthentication;

    /**
     * Show the general profile settings screen.
     */
    public function show(Request $request): Response
    {
        $this->validateTwoFactorAuthenticationState($request);

        return Workspaces::inertia()->render($request, 'settings/privacy-and-security/show', [
            'confirmsTwoFactorAuthentication' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            'sessions' => BrowserSessions::sessions(),
        ]);
    }
}
