<?php

declare(strict_types=1);

namespace App\Http\Controllers\API\Auth;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;

final class RegisteredUserController
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
     * Store a newly created resource in storage.
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
