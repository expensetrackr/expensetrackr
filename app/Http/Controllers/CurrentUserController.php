<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\User\UpdateUser;
use App\Actions\Workspaces\DeleteUser;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class CurrentUserController extends Controller
{
    /**
     * Update the user's profile settings.
     */
    public function update(UpdateUserRequest $request, UpdateUser $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated());

        return to_route('settings.show');
    }

    /**
     * Delete the current user.
     */
    public function destroy(Request $request, StatefulGuard $guard, DeleteUser $action): Response
    {
        $user = type($request->user())->as(User::class);

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

        $action->handle($user);

        $guard->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location(url('/'));
    }
}
