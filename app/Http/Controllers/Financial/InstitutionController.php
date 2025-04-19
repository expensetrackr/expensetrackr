<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Data\Finance\InstitutionSearchData;
use App\Services\MeilisearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class InstitutionController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, MeilisearchService $meilisearchService): JsonResponse
    {
        /** @var string $searchQuery */
        $searchQuery = $request->query('q', '') ?? $request->query('institution[q]', '');
        $institutions = $meilisearchService->search(
            'institutions',
            $searchQuery,
            [
                'limit' => 48,
                'sort' => [
                    'popularity:desc',
                ],
            ]
        );

        return response()->json(InstitutionSearchData::collect($institutions));
    }
}
