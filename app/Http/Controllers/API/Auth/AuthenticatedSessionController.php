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
use Knuckles\Scribe\Attributes\BodyParam;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\Response as ScribeResponse;
use Knuckles\Scribe\Attributes\Unauthenticated;

#[Group(name: 'Authentication')]
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
     * Login a user
     *
     * Attempt to authenticate a new session for the authenticated user.
     */
    #[Unauthenticated]
    #[BodyParam(name: 'email', type: 'string', description: 'The email of the user.', required: true)]
    #[BodyParam(name: 'password', type: 'string', description: 'The password of the user.', required: true)]
    #[BodyParam(name: 'device_name', type: 'string', description: 'The name of the device.', required: true)]
    #[ScribeResponse('', 200)]
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
     * Logout a user
     *
     * Logout the authenticated user.
     */
    #[ScribeResponse(null, 204)]
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
