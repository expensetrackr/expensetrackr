<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Cjmellor\BrowserSessions\Facades\BrowserSessions;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

final class OtherBrowserSessionsController extends Controller
{
    /**
     * Log out from other browser sessions.
     *
     * @throws AuthenticationException
     */
    public function destroy(Request $request, StatefulGuard $guard): RedirectResponse
    {
        $lastConfirmation = $request->session()->get(
            'auth.password_confirmed_at', 0
        );

        $lastConfirmed = Date::now()->unix() - $lastConfirmation;

        $confirmed = $lastConfirmed < $request->input(
            'seconds', config('auth.password_timeout', 900)
        );

        if (! $confirmed) {
            return back(303, [
                'seconds' => config('auth.password_timeout', 900) - $lastConfirmed,
            ]);
        }

        BrowserSessions::logoutOtherBrowserSessions();

        return back(303);
    }
}
