<?php

declare(strict_types=1);

namespace App\Http\Controllers\API\Auth;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

final readonly class AuthenticatedSessionController
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        /**
         * The guard implementation.
         */
        private StatefulGuard $guard
    ) {}

    /**
     * Attempt to authenticate a new session.
     */
    public function store(LoginRequest $request): JsonResponse|string
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'email' => ['These credentials do not match our records.'],
            ], 422);
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
