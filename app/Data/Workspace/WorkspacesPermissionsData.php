<?php

declare(strict_types=1);

namespace App\Data\Workspace;

use App\Models\User;
use App\Models\Workspace;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Illuminate\Support\Facades\Gate;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WorkspacesPermissionsData extends Data
{
    public function __construct(
        public readonly bool $canCreateWorkspaces,
        public readonly bool $canManageTwoFactorAuthentication,
        public readonly bool $canUpdatePassword,
        public readonly bool $canUpdateProfileInformation,
        public readonly bool $hasEmailVerification,
        public readonly bool $hasAccountDeletionFeatures,
        public readonly bool $hasApiFeatures,
        public readonly bool $hasWorkspaceFeatures,
        public readonly bool $hasTermsAndPrivacyPolicyFeature,
        public readonly bool $managesProfilePhotos,
    ) {}

    public static function fromUser(?User $user): self
    {
        return self::from([
            'canCreateWorkspaces' => Gate::forUser($user)->check('create', Workspace::class),
            'canManageTwoFactorAuthentication' => config('auth.two_factor.enabled'),
            'canUpdatePassword' => config('auth.update_password.enabled'),
            'canUpdateProfileInformation' => config('auth.update_profile_information.enabled'),
            'hasEmailVerification' => config('auth.verification.enabled'),
            'hasAccountDeletionFeatures' => WorkspaceFeatures::hasAccountDeletionFeatures(),
            'hasApiFeatures' => WorkspaceFeatures::hasApiFeatures(),
            'hasWorkspaceFeatures' => WorkspaceFeatures::hasWorkspaceFeatures(),
            'hasTermsAndPrivacyPolicyFeature' => WorkspaceFeatures::hasTermsAndPrivacyPolicyFeature(),
            'managesProfilePhotos' => WorkspaceFeatures::managesProfilePhotos(),
        ]);
    }
}
