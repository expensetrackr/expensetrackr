<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Data\Finance\InstitutionSearchData;
use App\Services\MeilisearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Knuckles\Scribe\Attributes\Group;
use Knuckles\Scribe\Attributes\QueryParam;
use Knuckles\Scribe\Attributes\Unauthenticated;

#[Group(name: 'Financial')]
final class InstitutionController
{
    /**
     * Institutions
     *
     * Search for financial institutions based on a query parameter.
     * Returns up to 48 results sorted by popularity in descending order.
     * This endpoint is commonly used to help users find and select their
     * bank or financial institution when connecting accounts.
     */
    #[Unauthenticated]
    #[QueryParam(name: 'q', type: 'string', description: 'The search query to find institutions by name', example: 'bank', required: false)]
    #[QueryParam(name: 'limit', type: 'integer', description: 'The number of results to return', example: 48, required: false)]
    public function __invoke(Request $request, MeilisearchService $meilisearchService): JsonResponse
    {
        /** @var string $searchQuery */
        $searchQuery = $request->query('q', '') ?? $request->query('institution[q]', '');
        /** @var int $limit */
        $limit = (int) $request->query('limit', '48');

        $institutions = $meilisearchService->search(
            'institutions',
            $searchQuery,
            [
                'limit' => $limit,
                'sort' => [
                    'popularity:desc',
                ],
            ]
        );

        return response()->json(InstitutionSearchData::collect($institutions));
    }
}
