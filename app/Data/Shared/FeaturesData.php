<?php

declare(strict_types=1);

namespace App\Data\Shared;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class FeaturesData extends Data
{
    public function __construct(
        public readonly bool $hasEmailVerification,
        public readonly bool $hasAccountDeletionFeatures,
        public readonly bool $hasApiFeatures,
        public readonly bool $hasWorkspaceFeatures,
        public readonly bool $hasTermsAndPrivacyPolicyFeature,
        public readonly bool $managesProfilePhotos,
    ) {}
}
