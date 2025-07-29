<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Data\Finance\InstitutionSearchData;
use App\Services\MeilisearchService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

#[Group('Financial')]
final class InstitutionController
{
    /**
     * List all financial institutions
     *
     * Search for financial institutions based on a query parameter.
     * Returns up to 48 results sorted by popularity in descending order.
     * This endpoint is commonly used to help users find and select their
     * bank or financial institution when connecting accounts.
     */
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
