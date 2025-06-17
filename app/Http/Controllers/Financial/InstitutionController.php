<?php

declare(strict_types=1);

namespace App\Http\Controllers\Financial;

use App\Data\Finance\InstitutionSearchData;
use App\Services\MeilisearchService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Log;

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

    /**
     * Track usage of an institution by incrementing its popularity count
     */
    public function trackUsage(string $institution, MeilisearchService $meilisearchService): JsonResponse
    {
        try {
            $searchResults = $meilisearchService->getDocument('institutions', $institution);

            if (empty($searchResults)) {
                return response()->json(['message' => 'Institution not found'], 404);
            }

            $currentDocument = $searchResults[0];

            $updatedDocument = array_merge($currentDocument, [
                'popularity' => ($currentDocument['popularity'] ?? 0) + 1,
                'last_used_at' => now()->toISOString(),
            ]);

            $meilisearchService->addDocuments('institutions', [$updatedDocument]);

            return response()->json([
                'message' => 'Usage tracked successfully',
                'popularity' => $updatedDocument['popularity'],
            ]);
        } catch (Exception $e) {
            Log::error('Failed to track institution usage', [
                'institution' => $institution,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Failed to track usage'], 500);
        }
    }
}
