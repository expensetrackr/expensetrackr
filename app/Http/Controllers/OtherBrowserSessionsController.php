<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Cjmellor\BrowserSessions\Facades\BrowserSessions;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class OtherBrowserSessionsController extends Controller
{
    /**
     * Log out from other browser sessions.
     *
     * @throws AuthenticationException
     */
    public function destroy(Request $request, StatefulGuard $guard): RedirectResponse
    {
        // TODO: Implement password confirmation

        $guard->logoutOtherDevices(type($request->password)->asString());

        BrowserSessions::logoutOtherBrowserSessions();

        return back(303);
    }
}
