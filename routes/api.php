<?php

declare(strict_types=1);

use App\Http\Controllers\API\AccountController;
use App\Http\Controllers\Financial\CurrencyController;
use App\Http\Controllers\Financial\InstitutionController;
use App\Http\Controllers\WebhookTellerController;
use Illuminate\Support\Facades\Route;

Route::post('teller/webhook', WebhookTellerController::class)
    ->name('teller.webhook');

// TODO: Secure API routes
Route::prefix('finance')->group(function () {
    Route::get('/currencies', CurrencyController::class)
        ->name('api.finance.currencies.index');

    Route::get('/institutions', InstitutionController::class)
        ->name('api.finance.institutions.index');
});

Route::apiResource('accounts', AccountController::class)->only('index')->names('api.accounts');
