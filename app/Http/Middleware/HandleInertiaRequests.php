<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Data\Auth\UserData;
use App\Data\Shared\ToastData;
use App\Data\Workspace\WorkspaceData;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\Workspace;
use App\Utilities\Translations\TranslationManager;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;
use JoelButcher\Socialstream\ConnectedAccount;
use JoelButcher\Socialstream\Socialstream;
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
            'language' => TranslationManager::getLanguage(),
            'languages' => TranslationManager::getLanguages($request),
            'translations' => TranslationManager::getAllTranslations(),
            'permissions' => [
                'canCreateAccounts' => Gate::forUser($request->user())->check('create', Account::class),
                'canCreateCategories' => Gate::forUser($request->user())->check('create', Category::class),
                'canCreateTransactions' => Gate::forUser($request->user())->check('create', Transaction::class),
                'canCreateWorkspaces' => Gate::forUser($request->user())->check('create', Workspace::class),
                'canManageTwoFactorAuthentication' => true,
                'canUpdatePassword' => true,
                'canUpdateProfileInformation' => true,
            ],
            'features' => [
                'hasEmailVerification' => true,
                'hasAccountDeletionFeatures' => WorkspaceFeatures::hasAccountDeletionFeatures(),
                'hasApiFeatures' => WorkspaceFeatures::hasApiFeatures(),
                'hasWorkspaceFeatures' => WorkspaceFeatures::hasWorkspaceFeatures(),
                'hasTermsAndPrivacyPolicyFeature' => WorkspaceFeatures::hasTermsAndPrivacyPolicyFeature(),
                'managesProfilePhotos' => WorkspaceFeatures::managesProfilePhotos(),
            ],
        ];
    }
}
