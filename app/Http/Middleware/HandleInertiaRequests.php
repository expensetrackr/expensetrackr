<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Data\Auth\UserData;
use App\Data\Shared\ToastData;
use App\Data\Workspace\WorkspaceData;
use App\Enums\Shared\Language;
use App\Http\Resources\LanguageResource;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Workspace;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;
use JoelButcher\Socialstream\ConnectedAccount;
use JoelButcher\Socialstream\Socialstream;
use Laravel\Fortify\Features;
use stdClass;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => $user ? [
                'user' => UserData::fromModel($user),
                'currentWorkspace' => WorkspaceData::optional($user->currentWorkspace),
                'workspaces' => WorkspaceData::collect($user->workspaces),
            ] : null,
            'socialstream' => [
                'show' => Socialstream::show(),
                'prompt' => config('socialstream.prompt', 'Or Login Via'),
                'providers' => Socialstream::providers(),
                'hasPassword' => $request->user()?->getAuthPassword() !== null,
                'connectedAccounts' => $request->user() ? $request->user()->connectedAccounts
                    ->map(fn (ConnectedAccount $account): stdClass => (object) $account->getSharedInertiaData()) : [],
            ],
            'toast' => ToastData::fromSession($request->session()->all()),
            'language' => session()->get('language', app()->getLocale()),
            'languages' => LanguageResource::collection(Language::cases())->toArray($request),
            'translations' => function () {
                $locale = app()->getLocale();
                $files = File::allFiles(base_path("lang/$locale"));

                // Get last modified time of all translation files
                $lastModified = collect($files)->max(fn ($file) => $file->getMTime());

                $cacheKey = "translations.$locale";
                $lastModifiedKey = "translations_modified.$locale";

                // If cached last modified time differs, invalidate cache
                if (cache()->get($lastModifiedKey) !== $lastModified) {
                    cache()->forget($cacheKey);
                }

                return cache()->remember($cacheKey, now()->addYear(), function () use ($files, $lastModified, $lastModifiedKey) {
                    cache()->forever($lastModifiedKey, $lastModified);

                    return collect($files)->flatMap(function ($file) {
                        $fileContents = File::getRequire($file->getRealPath());

                        return is_array($fileContents) ? Arr::dot($fileContents, $file->getBasename('.'.$file->getExtension()).'.') : [];
                    });
                });
            },
            'permissions' => [
                'canCreateAccounts' => Gate::forUser($request->user())->check('create', Account::class),
                'canCreateCategories' => Gate::forUser($request->user())->check('create', Category::class),
                'canCreateTransactions' => Gate::forUser($request->user())->check('create', Transaction::class),
                'canCreateWorkspaces' => Gate::forUser($request->user())->check('create', Workspace::class),
                'canManageTwoFactorAuthentication' => Features::canManageTwoFactorAuthentication(),
                'canUpdatePassword' => Features::enabled(Features::updatePasswords()),
                'canUpdateProfileInformation' => Features::canUpdateProfileInformation(),
            ],
            'features' => [
                'hasEmailVerification' => Features::enabled(Features::emailVerification()),
                'hasAccountDeletionFeatures' => WorkspaceFeatures::hasAccountDeletionFeatures(),
                'hasApiFeatures' => WorkspaceFeatures::hasApiFeatures(),
                'hasWorkspaceFeatures' => WorkspaceFeatures::hasWorkspaceFeatures(),
                'hasTermsAndPrivacyPolicyFeature' => WorkspaceFeatures::hasTermsAndPrivacyPolicyFeature(),
                'managesProfilePhotos' => WorkspaceFeatures::managesProfilePhotos(),
            ],
        ];
    }
}
