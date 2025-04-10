<?php

declare(strict_types=1);

namespace App\Data\Banking;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
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
