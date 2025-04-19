<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Facades\Forex;
use Illuminate\Http\JsonResponse;

final class CurrencyController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        return response()->json(Forex::getSupportedCurrencies() ?? []);
    }
}
