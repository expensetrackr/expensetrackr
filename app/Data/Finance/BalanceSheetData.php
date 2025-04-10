<?php

declare(strict_types=1);

namespace App\Data\Finance;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class BalanceSheetData extends Data
{
    public function __construct(
        public readonly ClassificationGroupData $assets,
        public readonly ClassificationGroupData $liabilities,
    ) {}
}
