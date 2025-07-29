<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Facades\Forex;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

#[Group('Financial')]
final class CurrencyController
{
    /**
     * List all supported currencies
     *
     * Retrieves a list of all supported currencies available in the system.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json(Forex::getSupportedCurrencies() ?? []);
    }
}
