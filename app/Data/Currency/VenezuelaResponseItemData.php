<?php

declare(strict_types=1);

namespace App\Data\Currency;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\CamelCaseMapper;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
#[MapName(SnakeCaseMapper::class, CamelCaseMapper::class)]
final class VenezuelaResponseItemData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $binance,
        public readonly string $dolartoday,
        public readonly string $localbitcoindt,
        public readonly string $yadio,
        public readonly string $airtm,
        public readonly ?string $akb,
        public readonly string $cambiosrya,
        public readonly string $mkambio,
        public readonly string $bcv,
        public readonly string $promediototalmk,
        public readonly string $promediovip,
        public readonly string $fecha,
        public readonly string $hora,
        public readonly string $horaEpv,
        public readonly string $fechaEpv,
        public readonly string $promEpv,
    ) {}
}
