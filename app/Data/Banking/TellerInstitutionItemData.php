<?php

declare(strict_types=1);

namespace App\Data\Banking;

use Spatie\LaravelData\Data;

final class TellerInstitutionItemData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        /** @var array<string> */
        public array $products,
    ) {}
}
