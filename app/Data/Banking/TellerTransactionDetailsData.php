<?php

declare(strict_types=1);

namespace App\Data\Banking;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class TellerTransactionDetailsData extends Data
{
    public function __construct(
        /**
         * Indicates the transaction enrichment processing status. Either `pending` or `complete`.
         */
        public readonly string $processingStatus,
        /**
         * The category that the transaction belongs to. Teller uses the following values for categorization: `accommodation`, `advertising`, `bar`, `charity`, `clothing`, `dining`, `education`, `electronics`, `entertainment`, `fuel`, `general`, `groceries`, `health`, `home`, `income`, `insurance`, `investment`, `loan`, `office`, `phone`, `service`, `shopping`, `software`, `sport`, `tax`, `transport`, `transportation`, and `utilities`.
         */
        public readonly ?string $category,
        /**
         * An object containing information regarding the transaction's recipient
         */
        public readonly TransactionDetailsCounterpartyData $counterparty,
    ) {}
}
