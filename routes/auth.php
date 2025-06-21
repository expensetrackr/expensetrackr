<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\RoutePath;

Route::group(['middleware' => config('fortify.middleware', ['web'])], function () {
    Route::get(RoutePath::for('login', '/login'), fn () => Inertia::render('auth/login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]))
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('login');

    if (Features::enabled(Features::resetPasswords())) {

        Route::get(RoutePath::for('password.request', '/forgot-password'), fn () => Inertia::render('auth/forgot-password', [
            'status' => session('status'),
        ]))
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('password.request');

        Route::get(RoutePath::for('password.reset', '/reset-password/{token}'), fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->input('email'),
            'token' => $request->route('token'),
        ]))
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('password.reset');
    }

    if (Features::enabled(Features::registration())) {
        Route::get(RoutePath::for('register', '/register'), fn () => Inertia::render('auth/register'))
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('register');
    }

    if (Features::enabled(Features::emailVerification())) {
        Route::get(RoutePath::for('verification.notice', '/email/verify'), fn () => Inertia::render('auth/verify-email', [
            'status' => session('status'),
        ]))
            ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
            ->name('verification.notice');
    }

    Route::get(RoutePath::for('password.confirm', '/user/confirm-password'), fn () => Inertia::render('auth/confirm-password'))
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
        ->name('password.confirm');

    if (Features::enabled(Features::twoFactorAuthentication())) {
        Route::get(RoutePath::for('two-factor.login', '/two-factor-challenge'), fn () => Inertia::render('auth/two-factor-challenge'))
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('two-factor.login');
    }

});
