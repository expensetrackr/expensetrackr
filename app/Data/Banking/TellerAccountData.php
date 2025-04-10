<?php

declare(strict_types=1);

namespace App\Data\Banking;

use App\Enums\Teller\AccountStatus;
use App\Enums\Teller\AccountSubtype;
use App\Enums\Teller\AccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class TellerAccountData extends Data
{
    public function __construct(
        public readonly string $currency,
        #[MapName('enrollment_id')]
        public readonly string $enrollmentId,
        public readonly string $id,
        public readonly TellerInstitutionData $institution,
        public readonly string $name,
        public readonly AccountType $type,
        public readonly AccountStatus $status,
        public readonly AccountSubtype $subtype,
        public ?TellerAccountBalanceData $balances,
    ) {}
}
