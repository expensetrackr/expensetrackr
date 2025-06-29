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
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleLanguageMiddleware::class,
            HandleWorkspacesPermissionMiddleware::class,
            AddWorkspaceToRequest::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->api(append: [
            HandleCors::class,
            EnsureFrontendRequestsAreStateful::class,
            ThrottleRequests::class.':api',
            HandleWorkspacesPermissionMiddleware::class,
            AddWorkspaceToRequest::class,
        ]);
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
