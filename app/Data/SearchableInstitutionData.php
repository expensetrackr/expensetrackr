<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

final class SearchableInstitutionData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $logo,
        /** @var array<string> */
        public array $countries,
        public int $popularity,
        public string $provider,
    ) {}
}
