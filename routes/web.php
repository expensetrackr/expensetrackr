<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\BankConnectionController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChangelogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::get('/', function (Request $request) {
    if ($request->user()) {
        return to_route('dashboard');
    }

    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/pricing', PricingController::class)->name('pricing');

// Add custom scribe routes with fallback
Route::get('/docs.openapi', function () {
    $path = Storage::disk('local')->path('scribe/openapi.yaml');

    if (! Storage::disk('local')->exists('scribe/openapi.yaml')) {
        // Try to generate the documentation
        try {
            Artisan::call('scribe:generate');
        } catch (Exception $e) {
            // If generation fails, return 404 or empty response
            abort(404, 'API documentation is not available.');
        }
    }

    // Check again after attempting to generate
    if (! Storage::disk('local')->exists('scribe/openapi.yaml')) {
        abort(404, 'API documentation is not available.');
    }

    return response()->file($path);
})->name('scribe.openapi');

Route::get('/docs', function () {
    return view('scribe.index');
})->name('scribe');

Route::get('/docs.postman', function () {
    if (! Storage::disk('local')->exists('scribe/collection.json')) {
        // Try to generate the documentation
        try {
            Artisan::call('scribe:generate');
        } catch (Exception $e) {
            abort(404, 'API documentation is not available.');
        }
    }

    if (! Storage::disk('local')->exists('scribe/collection.json')) {
        abort(404, 'API documentation is not available.');
    }

    return response()->file(Storage::disk('local')->path('scribe/collection.json'))
        ->header('Content-Type', 'application/json');
})->name('scribe.postman');

Route::get('/changelog', [ChangelogController::class, 'index'])->name('changelog.index');
Route::get('/changelog/{changelog}', [ChangelogController::class, 'show'])->name('changelog.show');

Route::middleware([
    'auth:sanctum',
    config('workspaces.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::post('/accounts', [AccountController::class, 'store'])->name('accounts.store');
    Route::get('/accounts', [AccountController::class, 'index'])->name('accounts.index');
    Route::get('/accounts/create', [AccountController::class, 'create'])->name('accounts.create');
    Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');

    Route::post('/bank-connections', [BankConnectionController::class, 'store'])->name('bank-connections.store');
    Route::get('/bank-connections/connect/{enrollmentId}/{provider}/{token}', [BankConnectionController::class, 'connect'])->name('bank-connections.connect');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::prefix('settings')->group(function () {
        Route::get('/', fn () => Inertia::render('settings/page'))->name('settings.show');
        Route::get('/billing', [BillingController::class, 'show'])->name('settings.billing.show');
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

        Route::get('/connected-accounts', fn () => Inertia::render('settings/connected-accounts/show'))->name('settings.connected-accounts.show');
    });

    Route::get('/subscribe', [BillingController::class, 'subscribe'])->name('subscribe');
});

Route::post('/language', LanguageController::class)->name('language.store');

Route::get('/thank-you', fn () => Inertia::render('thank-you'))->name('thank-you');

Route::get('health', HealthCheckResultsController::class);

require __DIR__.'/auth.php';
require __DIR__.'/socialstream.php';
require __DIR__.'/workspaces.php';
