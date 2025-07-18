<?php

declare(strict_types=1);

use App\Data\Auth\UserData;
use App\Data\Workspace\WorkspaceData;
use App\Http\Middleware\AddWorkspaceToRequest;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HandleLanguageMiddleware;
use App\Http\Middleware\HandleWorkspacesPermissionMiddleware;
use App\Utilities\Translations\TranslationManager;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        using: function () {
            $apiUrl = config('app.api_url');

            if ($apiUrl && trim($apiUrl) !== '') {
                // Extract domain from URL if it contains a scheme
                $domain = parse_url($apiUrl, PHP_URL_HOST) ?: $apiUrl;

                Route::domain($domain)
                    ->middleware('api')
                    ->group(base_path('routes/api.php'));
            } else {
                Route::prefix('api')
                    ->middleware('api')
                    ->group(base_path('routes/api.php'));
            }

            Route::middleware('web')
                ->middleware('web')
                ->group(base_path('routes/web.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(append: [
            AddWorkspaceToRequest::class,
            HandleWorkspacesPermissionMiddleware::class,
        ]);

        $middleware->web(append: [
            HandleLanguageMiddleware::class,
            HandleInertiaRequests::class,
            AddWorkspaceToRequest::class,
            HandleWorkspacesPermissionMiddleware::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->statefulApi();

        $middleware->validateCsrfTokens(except: [
            'polar/webhook',
            'teller/webhook',
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if (! $request->expectsJson() && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
                $user = $request->user();

                return Inertia::render('error', [
                    'auth' => $user ? [
                        'user' => UserData::fromModel($user),
                        'currentWorkspace' => WorkspaceData::optional($user->currentWorkspace),
                        'workspaces' => WorkspaceData::collect($user->workspaces),
                    ] : null,
                    'status' => $response->getStatusCode(),
                    'language' => TranslationManager::getLanguage(),
                    'languages' => TranslationManager::getLanguages($request),
                    'translations' => TranslationManager::getAllTranslations(),
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            if ($response->getStatusCode() === 419) {
                return back()->with('toast', [
                    'title' => 'The page expired, please try again.',
                    'type' => 'error',
                ]);
            }

            return $response;
        });

    })->create();
