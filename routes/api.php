<?php

declare(strict_types=1);

use App\Http\Controllers\API\AccountController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\Financial\CurrencyController;
use App\Http\Controllers\Financial\InstitutionController;
use App\Http\Controllers\WebhookTellerController;
use Illuminate\Support\Facades\Route;

Route::post('teller/webhook', WebhookTellerController::class)
    ->name('teller.webhook');

Route::prefix('finance')->group(function () {
    Route::get('/currencies', CurrencyController::class)
        ->name('api.finance.currencies.index');

    Route::get('/institutions', InstitutionController::class)
        ->name('api.finance.institutions.index');
    Route::post('/institutions/{institution}/track-usage', [InstitutionController::class, 'trackUsage'])
        ->name('api.finance.institutions.track-usage');
    });

Route::apiResource('accounts', AccountController::class)
    ->only(['index', 'show'])
    ->names('api.accounts');

Route::apiResource('categories', CategoryController::class)
    ->only(['index', 'show'])
    ->names('api.categories');

Route::apiResource('transactions', TransactionController::class)
    ->only('show')
    ->names('api.transactions');
