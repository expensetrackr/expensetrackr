<?php

declare(strict_types=1);

namespace App\Data\Shared;

use App\Data\Auth\InertiaAuthData;
use App\Data\Socialstream\SocialstreamData;
use App\Data\Workspace\WorkspacesPermissionsData;
use App\Enums\Shared\Language;
use Closure;
use Inertia\AlwaysProp;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SharedInertiaData extends Data
{
    public function __construct(
        public readonly ?InertiaAuthData $auth,
        public readonly ?WorkspacesPermissionsData $workspaces,
        public readonly ?ToastData $toast,
        public readonly Language $language,
        /** @var array<LanguageData>|null */
        public readonly ?array $languages,
        /** @var array<string, string>|Closure */
        #[LiteralTypeScriptType('Record<string, string>')]
        public readonly array|Closure $translations,
        public readonly SocialstreamData $socialstream,
        public readonly PermissionsData $permissions,
        /** @var array<string,string>|null */
        public readonly array|string|AlwaysProp|null $errors = null,
    ) {}
}
