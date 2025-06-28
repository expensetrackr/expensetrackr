<?php

declare(strict_types=1);

namespace App\Http\Controllers\API\Auth;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class AuthenticatedSessionController
{
    /**
     * The guard implementation.
     */
    private StatefulGuard $guard;

    /**
     * Create a new controller instance.
     */
    public function __construct(StatefulGuard $guard)
    {
        $this->guard = $guard;
    }

    /**
     * Attempt to authenticate a new session.
     */
    public function store(LoginRequest $request): RedirectResponse|string
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        return $user->createToken(name: $request->device_name)->plainTextToken;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $this->guard->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->noContent();
    }
}
