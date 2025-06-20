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
            $result = $meilisearchService->trackInstitutionUsage($institution);

            if (! $result['success']) {
                return response()->json(['message' => $result['message']], 404);
            }

            return response()->json([
                'message' => 'Usage tracked successfully',
                'institution_id' => $result['institution_id'],
                'task_id' => $result['task_id'],
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
