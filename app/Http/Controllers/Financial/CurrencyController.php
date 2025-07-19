<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Facades\Forex;
use Illuminate\Http\JsonResponse;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\Unauthenticated;

#[Group(name: 'Financial')]
final class CurrencyController
{
    /**
     * Currencies
     *
     * Retrieves a list of all supported currencies available in the system.
     */
    #[Unauthenticated]
    public function __invoke(): JsonResponse
    {
        return response()->json(Forex::getSupportedCurrencies() ?? []);
    }
}
