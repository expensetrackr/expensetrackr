<?php

declare(strict_types=1);

namespace App\Data\Common;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class LanguageData extends Data
{
    public function __construct(
        public string $code,
        public string $name,
    ) {}
}
