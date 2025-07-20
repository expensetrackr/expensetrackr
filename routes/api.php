<?php

declare(strict_types=1);

use App\Http\Controllers\API\AccountController;
use App\Http\Controllers\API\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\Auth\PasswordResetLinkController;
use App\Http\Controllers\API\Auth\RegisteredUserController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\Financial\CurrencyController;
use App\Http\Controllers\Financial\InstitutionController;
use App\Http\Controllers\WebhookTellerController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::get('/docs', fn () => view('scribe.index'))->name('scribe');

Route::get('/docs.postman', fn () => response()->file(public_path('docs/collection.json'), ['Content-Type' => 'application/json']))->name('scribe.postman');

Route::get('/docs.openapi', fn () => response()->file(public_path('docs/openapi.yaml'), ['Content-Type' => 'text/yaml']))->name('scribe.openapi');

Route::post('teller/webhook', WebhookTellerController::class)
    ->name('teller.webhook');

Route::prefix('finance')->group(function () {
    /**
     * Currencies
     */
    Route::get('/currencies', CurrencyController::class)
        ->name('api.finance.currencies.index');

    Route::get('/institutions', InstitutionController::class)
        ->name('api.finance.institutions.index');
});

Route::middleware(['auth:sanctum', config('workspaces.auth_session')])->group(function () {
    Route::apiResource('accounts', AccountController::class)
        ->only(['index', 'store', 'show', 'update', 'destroy'])
        ->names('api.accounts');

    Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'show'])
        ->names('api.categories');

    Route::apiResource('transactions', TransactionController::class)
        ->only('show')
        ->names('api.transactions');

    Route::get('accounts/stats', [AccountController::class, 'stats'])->name('api.accounts.stats');

});

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->middleware([
            'guest:'.config('fortify.guard'),
            'throttle:login',
        ])
        ->name('api.auth.login');

    if (Features::enabled(Features::resetPasswords())) {
        Route::post('forgot-password',
            [PasswordResetLinkController::class, 'store'])
            ->middleware([
                'guest:'.config('fortify.guard'),
                'throttle:forgot-password',
            ])
            ->name('api.auth.forgot-password');
    }

    if (Features::enabled(Features::registration())) {
        Route::post('register', [RegisteredUserController::class, 'store'])
            ->middleware([
                'guest:'.config('fortify.guard'),
                'throttle:register',
            ])
            ->name('api.auth.register');
    }

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware([
            'auth:sanctum',
            'throttle:logout',
        ])
        ->name('api.auth.logout');
});

Route::get('health', HealthCheckResultsController::class);
