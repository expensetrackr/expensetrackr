<?php

declare(strict_types=1);

namespace App\Data\Ziggy;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ZiggyData extends Data
{
    public function __construct(
        public string $url,
        public ?int $port,
        /** @var array<string, mixed> */
        public array $defaults,
        /** @var array<string, RouteData> */
        public array $routes,
        public ?string $location,
    ) {}
}
