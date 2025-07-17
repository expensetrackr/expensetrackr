<?php

declare(strict_types=1);

/*
 * API ROUTES OVERVIEW
 * ===================
 *
 * This file defines two distinct API route groups:
 *
 * 1. INTERNAL API ROUTES (internal.api.*)
 *    - No authentication required
 *    - Read-only operations
 *    - Public data access
 *    - System-to-system communication
 *
 * 2. AUTHENTICATED API ROUTES (api.*)
 *    - Authentication required (auth:sanctum)
 *    - Workspace context required (ensure.workspace)
 *    - Full CRUD operations
 *    - User-specific data operations
 *
 * Route Naming Convention:
 * - Internal routes: internal.api.{resource}.{action}
 * - Authenticated routes: api.{resource}.{action}
 *
 * Choose the appropriate route group based on your use case:
 * - Use internal routes for public data that doesn't require user context
 * - Use authenticated routes for user-specific operations
 */

use App\Http\Controllers\API\AccountController;
use App\Http\Controllers\API\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\Auth\RegisteredUserController;
use App\Http\Controllers\API\BulkAccountController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\Financial\CurrencyController;
use App\Http\Controllers\Financial\InstitutionController;
use App\Http\Controllers\WebhookTellerController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

/*
 * INTERNAL API ROUTES (No Authentication Required)
 * ================================================
 * These routes are designed for internal system use and public data access.
 * They are READ-ONLY and do not require authentication.
 * Use these routes for:
 * - Public data that doesn't require user context
 * - System-to-system communication
 * - Data that should be accessible without workspace context
 *
 * Security Notes:
 * - No authentication required
 * - No workspace context
 * - Limited to safe HTTP methods (GET only for most resources)
 * - Should not expose sensitive user data
 */
Route::prefix('api')->group(function () {
    Route::post('teller/webhook', WebhookTellerController::class)
        ->name('teller.webhook');

    Route::prefix('finance')->group(function () {
        Route::get('/currencies', CurrencyController::class)
            ->name('internal.api.finance.currencies.index');

        Route::get('/institutions', InstitutionController::class)
            ->name('internal.api.finance.institutions.index');
    });

    Route::apiResource('accounts', AccountController::class)
        ->names('internal.api.accounts');

    Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'show'])
        ->names('internal.api.categories');

    Route::apiResource('transactions', TransactionController::class)
        ->only('show')
        ->names('internal.api.transactions');
});

$routeGroup = function () {
    Route::get('health', HealthCheckResultsController::class);

    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthenticatedSessionController::class, 'store'])
            ->middleware([
                'guest:'.config('fortify.guard'),
                'throttle:login',
            ])
            ->name('api.auth.login');

        if (Features::enabled(Features::resetPasswords())) {
            Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
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

    Route::prefix('finance')->group(function () {
        Route::get('/currencies', CurrencyController::class)
            ->name('api.finance.currencies.index');

        Route::get('/institutions', InstitutionController::class)
            ->name('api.finance.institutions.index');
    });

    /*
     * AUTHENTICATED API ROUTES (Authentication & Workspace Required)
     * ==============================================================
     * These routes are designed for authenticated user operations.
     * They require both authentication and workspace context.
     * Use these routes for:
     * - User-specific data operations (CRUD)
     * - Workspace-scoped operations
     * - Operations that modify user data
     *
     * Security Notes:
     * - Requires authentication (auth:sanctum)
     * - Requires workspace context (ensure.workspace middleware)
     * - Full CRUD operations available
     * - Data is scoped to user's current workspace
     * - All operations are subject to authorization policies
     */
    Route::middleware(['auth:sanctum', 'ensure.workspace'])->group(function () {
        // Account statistics and type filtering
        Route::get('accounts/stats', [AccountController::class, 'stats'])->name('api.accounts.stats');
        Route::get('accounts/type/{type}', [AccountController::class, 'byType'])->name('api.accounts.by-type');

        // Bulk operations
        Route::prefix('accounts/bulk')->name('api.accounts.bulk.')->group(function () {
            Route::post('create', [BulkAccountController::class, 'bulkCreate'])->name('create');
            Route::post('update', [BulkAccountController::class, 'bulkUpdate'])->name('update');
            Route::post('delete', [BulkAccountController::class, 'bulkDelete'])->name('delete');
            Route::post('export', [BulkAccountController::class, 'bulkExport'])->name('export');
            Route::post('import', [BulkAccountController::class, 'bulkImport'])->name('import');
            Route::post('status', [BulkAccountController::class, 'bulkStatus'])->name('status');
        });

        // Standard CRUD operations
        Route::apiResource('accounts', AccountController::class)
            ->names('api.accounts');

        Route::apiResource('categories', CategoryController::class)
            ->names('api.categories');

        Route::apiResource('transactions', TransactionController::class)
            ->names('api.transactions');
    });
};

if ($domain = config('app.api_domain')) {
    Route::domain($domain)->group($routeGroup);
} else {
    $routeGroup();
}
