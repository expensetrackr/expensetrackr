<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::middleware([
    'auth:sanctum',
    config('workspaces.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::post('/accounts', [AccountController::class, 'store'])->name('accounts.store');
    Route::post('/accounts/bank-connections', [AccountController::class, 'storeBankConnections'])->name('accounts.bank-connections.store');
    Route::get('/accounts', [AccountController::class, 'index'])->name('accounts.index');
    Route::get('/accounts/create', [AccountController::class, 'create'])->name('accounts.create');
    Route::get('/accounts/create/{connectionType}', [AccountController::class, 'createAccountByType'])
        ->where('connectionType', 'manual|connect')
        ->name('accounts.create.connection-type');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

    Route::prefix('settings')->group(function () {
        Route::get('/', fn () => Inertia::render('settings/show'))->name('settings.show');

        Route::get('/connected-accounts', fn () => Inertia::render('settings/connected-accounts/show'))->name('settings.connected-accounts.show');
    });
});

Route::post('/language', LanguageController::class)->name('language.store');

require __DIR__.'/socialstream.php';
require __DIR__.'/workspaces.php';
