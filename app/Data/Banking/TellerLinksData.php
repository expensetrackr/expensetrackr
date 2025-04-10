<?php

declare(strict_types=1);

namespace App\Data\Banking;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
abstract class TellerLinksData extends Data
{
    public function __construct(
        /**
         * A self link to the object.
         */
        public readonly string $self,
    ) {}
}
