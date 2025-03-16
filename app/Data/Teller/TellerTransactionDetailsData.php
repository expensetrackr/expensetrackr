<?php

declare(strict_types=1);

namespace App\Data\Teller;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

final class TellerTransactionDetailsData extends Data
{
    public function __construct(
        /**
         * Indicates the transaction enrichment processing status. Either `pending` or `complete`.
         */
        #[MapName('processing_status')]
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
