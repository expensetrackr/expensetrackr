<?php

declare(strict_types=1);

namespace App\Data\Teller;

use Spatie\LaravelData\Data;

final class TransactionDetailsCounterpartyData extends Data
{
    public function __construct(
        /**
         * The processed counterparty name.
         */
        public readonly ?string $name,
        /**
         * The counterparty type: `organization` or `person`.
         */
        public readonly ?string $type,
    ) {}
}
