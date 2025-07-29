<?php

declare(strict_types=1);

namespace App\Http\Controllers\API\Auth;

use App\Actions\Fortify\CreateNewUser;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;

#[Group('Authentication')]
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
     *
     * @unauthenticated
     */
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
