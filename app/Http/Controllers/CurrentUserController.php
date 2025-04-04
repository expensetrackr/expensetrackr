<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Workspaces\DeleteUser;
use App\Models\User;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Actions\ConfirmPassword;
use Symfony\Component\HttpFoundation\Response;

final class CurrentUserController extends Controller
{
    /**
     * Delete the current user.
     */
    public function destroy(Request $request, StatefulGuard $guard, DeleteUser $action): Response
    {
        $user = type($request->user())->as(User::class);
        $confirmed = app(ConfirmPassword::class)(
            $guard,
            $user,
            type($request->password)->asString()
        );

        if (! $confirmed) {
            throw ValidationException::withMessages([
                'password' => __('passwords.incorrect'),
            ]);
        }

        $action->handle($user);

        $guard->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(url('/'));
    }
}
