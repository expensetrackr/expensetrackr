<?php

declare(strict_types=1);

namespace App\Data\Banking;

use App\Enums\Banking\TellerAccountStatus;
use App\Enums\Banking\TellerAccountSubtype;
use App\Enums\Banking\TellerAccountType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class TellerAccountData extends Data
{
    public function __construct(
        public readonly string $currency,
        public readonly string $enrollmentId,
        public readonly string $id,
        public readonly TellerInstitutionData $institution,
        public readonly string $name,
        public readonly TellerAccountType $type,
        public readonly TellerAccountStatus $status,
        public readonly TellerAccountSubtype $subtype,
        public ?TellerAccountBalanceData $balances,
    ) {}
}
