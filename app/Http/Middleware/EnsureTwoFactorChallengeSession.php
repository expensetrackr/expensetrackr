<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

final class EnsureTwoFactorChallengeSession
{
    /**
     * Handle an incoming request.
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $userId = $request->session()->get('login.id');

        try {
            $user = Cache::remember("user.{$userId}", 300, fn () => User::find($userId));

            if (! $user) {
                $request->session()->forget('login.id');

                return redirect()->route('login')->withErrors(['error' => 'Invalid session. Please log in again.']);
            }
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors(['error' => 'Authentication error. Please try again.']);
        }

        // Share the user with the request for controllers to use
        $request->merge(['two_factor_auth_user' => $user]);

        return $next($request);
    }
}
