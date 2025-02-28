<?php

declare(strict_types=1);

namespace App\Data\Ziggy;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class RouteData extends Data
{
    public function __construct(
        public string $uri,
        /** @var array<string> */
        public array $methods,
        /** @var array<string> */
        public ?array $parameters,
        /** @var array<string, string> */
        public ?array $bindings
    ) {}
}
