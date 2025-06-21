<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfirmPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    /**
     * Confirm the user's password.
     */
    public function store(ConfirmPasswordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $validated['password'],
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Get the password confirmation status.
     */
    public function status(Request $request)
    {
        $lastConfirmation = $request->session()->get(
            'auth.password_confirmed_at', 0
        );

        $lastConfirmed = Date::now()->unix() - $lastConfirmation;

        $confirmed = $lastConfirmed < $request->input(
            'seconds', config('auth.password_timeout', 900)
        );

        return response()->json([
            'confirmed' => $confirmed,
        ], headers: array_filter([
            'X-Retry-After' => $confirmed ? $lastConfirmed : null,
        ]));
    }
}
