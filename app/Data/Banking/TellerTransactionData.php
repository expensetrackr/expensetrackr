<?php

declare(strict_types=1);

namespace App\Data\Banking;

use App\Enums\Teller\TransactionStatus;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

final class TellerTransactionData extends Data
{
    public function __construct(
        /**
         * The id of the account that the transaction belongs to.
         */
        #[MapName('account_id')]
        public readonly string $accountId,
        /**
         * The signed amount of the transaction as a string.
         */
        public readonly string $amount,
        /**
         * The ISO 8601 date of the transaction.
         */
        public readonly string $date,
        /**
         * The unprocessed transaction description as it appears on the bank statement.
         */
        public readonly string $description,
        /**
         * An object containing additional information regarding the transaction added by Teller's transaction enrichment.
         */
        public readonly TellerTransactionDetailsData $details,
        /**
         * The transaction's status: `posted` or `pending`.
         */
        public readonly TransactionStatus $status,
        /**
         * The id of the transaction itself.
         */
        public readonly string $id,
        /**
         * An object containing links to related resources. A link indicates the enrollment supports that type of resource. Not every institution implements all of the capabilities that Teller supports. Your application should reflect on the contents of this object to determine what is supported by the financial institution.
         */
        public readonly TellerTransactionLinksData $links,
        /**
         * The running balance of the account that the transaction belongs to. Running balance is only present on transactions with a `posted` status.
         */
        #[MapName('running_balance')]
        public readonly ?string $runningBalance,
        /**
         * The type code transaction, e.g. `card_payment`.
         */
        public readonly string $type,
    ) {}
}
