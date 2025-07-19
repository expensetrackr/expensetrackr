<?php

declare(strict_types=1);

namespace App\Http\Controllers\API\Auth;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Knuckles\Scribe\Attributes\BodyParam;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\Unauthenticated;
use Laravel\Fortify\Fortify;

#[Group(name: 'Authentication')]
final readonly class RegisteredUserController
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
     * Register a new user
     *
     * Register a new user account.
     */
    #[Unauthenticated]
    #[BodyParam(name: 'name', type: 'string', description: 'The name of the user.', required: true)]
    #[BodyParam(name: 'email', type: 'string', description: 'The email of the user.', required: true)]
    #[BodyParam(name: 'password', type: 'string', description: 'The password of the user.', required: true)]
    #[BodyParam(name: 'password_confirmation', type: 'string', description: 'The password confirmation of the user.', required: true)]
    #[BodyParam(name: 'terms', type: 'boolean', description: 'Whether the user has accepted the terms and conditions.', required: true)]
    #[BodyParam(name: 'device_name', type: 'string', description: 'The name of the device.', required: true)]
    public function store(Request $request, CreateNewUser $creator): string
    {
        if (config('fortify.lowercase_usernames') && $request->has(Fortify::username())) {
            $request->merge([
                Fortify::username() => Str::lower($request->{Fortify::username()}),
            ]);
        }

        event(new Registered($user = $creator->create($request->all())));

        $this->guard->login($user, $request->boolean('remember'));

        return $user->createToken(name: $request->device_name)->plainTextToken;
    }
}
