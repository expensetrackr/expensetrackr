<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Workspaces\Http\Controllers\ApiTokenController;
use Workspaces\Http\Controllers\CurrentUserController;
use Workspaces\Http\Controllers\CurrentWorkspaceController;
use Workspaces\Http\Controllers\OtherBrowserSessionsController;
use Workspaces\Http\Controllers\PrivacyAndSecurityController;
use Workspaces\Http\Controllers\PrivacyPolicyController;
use Workspaces\Http\Controllers\ProfilePhotoController;
use Workspaces\Http\Controllers\TermsOfServiceController;
use Workspaces\Http\Controllers\WorkspaceController;
use Workspaces\Http\Controllers\WorkspaceInvitationController;
use Workspaces\Http\Controllers\WorkspaceMemberController;
use Workspaces\Workspaces;

Route::group(['middleware' => config('workspaces.middleware', ['web'])], function () {
    if (Workspaces::hasTermsAndPrivacyPolicyFeature()) {
        Route::get('/terms-of-service', [TermsOfServiceController::class, 'show'])->name('terms.show');
        Route::get('/privacy-policy', [PrivacyPolicyController::class, 'show'])->name('policy.show');
    }

    $authMiddleware = config('workspaces.guard')
        ? 'auth:'.type(config('workspaces.guard'))->asString()
        : 'auth';

    $authSessionMiddleware = config('workspaces.auth_session', false)
        ? config('workspaces.auth_session')
        : null;

    Route::group(['middleware' => array_filter([$authMiddleware, $authSessionMiddleware])], function () {
        Route::prefix('settings')->group(function () {
            Route::get('/privacy-and-security', [PrivacyAndSecurityController::class, 'show'])->name('settings.privacy-and-security.show');
        });

        Route::delete('/user/other-browser-sessions', [OtherBrowserSessionsController::class, 'destroy'])
            ->name('other-browser-sessions.destroy');

        Route::delete('/user/profile-photo', [ProfilePhotoController::class, 'destroy'])
            ->name('current-user-photo.destroy');

        if (Workspaces::hasAccountDeletionFeatures()) {
            Route::delete('/user', [CurrentUserController::class, 'destroy'])
                ->name('current-user.destroy');
        }

        Route::group(['middleware' => 'verified'], function () {
            // API...
            if (Workspaces::hasApiFeatures()) {
                Route::get('/user/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
                Route::post('/user/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
                Route::put('/user/api-tokens/{token}', [ApiTokenController::class, 'update'])->name('api-tokens.update');
                Route::delete('/user/api-tokens/{token}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');
            }

            // Workspaces...
            if (Workspaces::hasWorkspaceFeatures()) {
                Route::get('/workspaces/create', [WorkspaceController::class, 'create'])->name('workspaces.create');
                Route::post('/workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
                Route::get('/workspaces/{workspace}', [WorkspaceController::class, 'show'])->name('workspaces.show');
                Route::put('/workspaces/{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
                Route::delete('/workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
                Route::put('/current-workspace', [CurrentWorkspaceController::class, 'update'])->name('current-workspace.update');
                Route::post('/workspaces/{workspace}/members', [WorkspaceMemberController::class, 'store'])->name('workspace-members.store');
                Route::put('/workspaces/{workspace}/members/{user}', [WorkspaceMemberController::class, 'update'])->name('workspace-members.update');
                Route::delete('/workspaces/{workspace}/members/{user}', [WorkspaceMemberController::class, 'destroy'])->name('workspace-members.destroy');

                Route::get('/workspace-invitations/{invitation}', [WorkspaceInvitationController::class, 'accept'])
                    ->middleware(['signed'])
                    ->name('workspace-invitations.accept');

                Route::delete('/workspace-invitations/{invitation}', [WorkspaceInvitationController::class, 'destroy'])
                    ->name('workspace-invitations.destroy');
            }
        });
    });
});
