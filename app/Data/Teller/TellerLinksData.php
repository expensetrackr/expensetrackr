<?php

declare(strict_types=1);

namespace App\Data\Teller;

use Spatie\LaravelData\Data;

abstract class TellerLinksData extends Data
{
    public function __construct(
        /**
         * A self link to the object.
         */
        public readonly string $self,
    ) {}
}
