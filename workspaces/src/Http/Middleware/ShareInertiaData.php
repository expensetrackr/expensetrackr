<?php

declare(strict_types=1);

namespace Workspaces\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Workspaces\Workspaces;

final class ShareInertiaData
{
    /**
     * Handle the incoming request.
     */
    public function handle(Request $request, callable $next): mixed
    {
        Inertia::share(array_filter([
            'workspaces' => function () use ($request) {
                $user = $request->user();

                return [
                    'canCreateWorkspaces' => $user &&
                        Workspaces::userHasWorkspaceFeatures($user) &&
                        Gate::forUser($user)->check('create', Workspaces::newWorkspaceModel()),
                    'canManageTwoFactorAuthentication' => Features::canManageTwoFactorAuthentication(),
                    'canUpdatePassword' => Features::enabled(Features::updatePasswords()),
                    'canUpdateProfileInformation' => Features::canUpdateProfileInformation(),
                    'hasEmailVerification' => Features::enabled(Features::emailVerification()),
                    'flash' => $request->session()->get('flash', []),
                    'hasAccountDeletionFeatures' => Workspaces::hasAccountDeletionFeatures(),
                    'hasApiFeatures' => Workspaces::hasApiFeatures(),
                    'hasWorkspaceFeatures' => Workspaces::hasWorkspaceFeatures(),
                    'hasTermsAndPrivacyPolicyFeature' => Workspaces::hasTermsAndPrivacyPolicyFeature(),
                    'managesProfilePhotos' => Workspaces::managesProfilePhotos(),
                ];
            },
            'auth' => [
                'user' => function () use ($request) {
                    if (! $user = $request->user()) {
                        return;
                    }

                    $userHasWorkspaceFeatures = Workspaces::userHasWorkspaceFeatures($user);

                    if ($userHasWorkspaceFeatures) {
                        $user->currentWorkspace;
                    }

                    return array_merge($user->toArray(), array_filter([
                        'all_workspaces' => $userHasWorkspaceFeatures ? $user->allWorkspaces()->values() : null,
                    ]), [
                        'two_factor_enabled' => Features::enabled(Features::twoFactorAuthentication())
                            && ! is_null($user->two_factor_secret),
                    ]);
                },
            ],
            'errorBags' => function () {
                return collect(optional(Session::get('errors'))->getBags() ?: [])->mapWithKeys(fn ($bag, $key) => [$key => $bag->messages()])->all();
            },
        ]));

        return $next($request);
    }
}
