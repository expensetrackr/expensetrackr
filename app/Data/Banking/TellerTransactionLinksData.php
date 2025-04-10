<?php

declare(strict_types=1);

namespace App\Data\Banking;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TellerTransactionLinksData extends TellerLinksData
{
    public function __construct(
        /**
         * A link to the account that the transaction belongs to.
         */
        public readonly string $account,
    ) {}
}
