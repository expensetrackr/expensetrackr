<?php

declare(strict_types=1);

use App\Http\Controllers\InstitutionController;
use App\Http\Controllers\WebhookTellerController;
use Illuminate\Support\Facades\Route;

Route::post('teller/webhook', WebhookTellerController::class)
    ->name('teller.webhook');

// TODO: Secure API routes
Route::prefix('finance')->group(function () {
    Route::get('/institutions', InstitutionController::class)
        ->name('api.finance.institutions.index');
});
