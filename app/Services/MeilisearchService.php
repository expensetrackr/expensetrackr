<?php

declare(strict_types=1);

namespace App\Services;

use Exception;
use Meilisearch\Client;

final readonly class MeilisearchService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client(
            type(config('scout.meilisearch.host'))->asString(),
            type(config('scout.meilisearch.key'))->asString()
        );
    }

    /**
     * Add documents to a specified index
     *
     * @param  string  $indexName  The name of the index
     * @param  array<int|string, mixed>  $documents  The documents to add
     * @param  list<non-empty-string>  $sortableAttributes  Additional options for the operation
     * @return array<mixed> The operation result
     */
    public function addDocuments(string $indexName, array $documents, array $sortableAttributes = []): array
    {
        $index = $this->client->index($indexName);

        if (count($sortableAttributes) > 0) {
            $index->updateSortableAttributes($sortableAttributes);
        }

        $result = $index->addDocuments($documents);

        return is_array($result) ? $result : [];
    }

    /**
     * Search documents in an index or retrieve all documents if no query is provided
     *
     * @param  string  $indexName  The name of the index to search in
     * @param  string|null  $query  The search query (optional)
     * @param  array<string, mixed>  $searchParams  Additional search parameters like filters, sort, etc. (optional)
     * @return array<mixed> Search results
     */
    public function search(string $indexName, ?string $query = null, array $searchParams = []): array
    {
        $index = $this->client->index($indexName);

        return $index->search($query, array_merge($searchParams, ['showRankingScore' => true]))->getHits();
    }

    /**
     * Get a specific document by its ID
     *
     * @param  string  $indexName  The name of the index
     * @param  string  $documentId  The ID of the document to retrieve
     * @return array<mixed>|null The document or null if not found
     */
    public function getDocument(string $indexName, string $documentId): ?array
    {
        $index = $this->client->index($indexName);

        try {
            $document = $index->getDocument($documentId);

            return is_array($document) ? $document : null;
        } catch (Exception) {
            return null;
        }
    }

    /**
     * Add or replace documents in an index
     *
     * @param  string  $indexName  The name of the index
     * @param  array<int|string, mixed>  $documents  The documents to update
     * @return array<mixed> The operation result
     */
    public function updateDocuments(string $indexName, array $documents): array
    {
        $index = $this->client->index($indexName);

        $result = $index->updateDocuments($documents);

        return is_array($result) ? $result : [];
    }

    /**
     * Set specific settings for an index
     *
     * @param  string  $indexName  The name of the index
     * @param  array<string, mixed>  $settings  The settings to update
     */
    public function updateSettings(string $indexName, array $settings): void
    {
        $index = $this->client->index($indexName);

        if (isset($settings['searchableAttributes']) && is_array($settings['searchableAttributes'])) {
            /** @var list<non-empty-string> $searchableAttributes */
            $searchableAttributes = array_values(array_filter($settings['searchableAttributes'], 'is_string'));
            $index->updateSearchableAttributes($searchableAttributes);
        }

        if (isset($settings['filterableAttributes']) && is_array($settings['filterableAttributes'])) {
            /** @var list<non-empty-string> $filterableAttributes */
            $filterableAttributes = array_values(array_filter($settings['filterableAttributes'], 'is_string'));
            $index->updateFilterableAttributes($filterableAttributes);
        }

        if (isset($settings['sortableAttributes']) && is_array($settings['sortableAttributes'])) {
            /** @var list<non-empty-string> $sortableAttributes */
            $sortableAttributes = array_values(array_filter($settings['sortableAttributes'], 'is_string'));
            $index->updateSortableAttributes($sortableAttributes);
        }

        if (isset($settings['rankingRules']) && is_array($settings['rankingRules'])) {
            /** @var list<non-empty-string> $rankingRules */
            $rankingRules = array_values(array_filter($settings['rankingRules'], 'is_string'));
            $index->updateRankingRules($rankingRules);
        }
    }

    /**
     * Delete an index
     */
    public function deleteIndex(string $indexName): void
    {
        $this->client->deleteIndex($indexName);
    }

    /**
     * Get direct access to the client for more operations
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * Update a single document by its ID
     *
     * @param  string  $indexName  The name of the index
     * @param  string  $documentId  The ID of the document to update
     * @param  mixed  $document  The updated document data
     * @return array<mixed> The update operation result
     */
    public function updateDocument(string $indexName, string $documentId, mixed $document): array
    {
        $index = $this->client->index($indexName);

        // Convert to array if it's not already
        $documentData = [];

        if (is_array($document)) {
            $documentData = $document;
        } elseif (is_object($document) && method_exists($document, 'toArray')) {
            $documentData = $document->toArray();
        } elseif (is_object($document)) {
            $documentData = (array) $document;
        }

        // Ensure the document contains the ID
        if (is_array($documentData)) {
            $documentData['id'] = $documentId;
        }

        $result = $index->updateDocuments([$documentData]);

        return is_array($result) ? $result : [];
    }

    /**
     * Increment a numeric field in a document atomically.
     *
     * This method uses an experimental Meilisearch feature 'editDocumentsByFunction'
     * which needs to be enabled on the Meilisearch instance. This function is designed
     * to be atomic and prevent race conditions by sending the modification logic to
     * Meilisearch to be executed on the server.
     *
     * See: https://github.com/orgs/meilisearch/discussions/762
     *
     * @param  string  $indexName  The name of the index
     * @param  string  $documentId  The ID of the document to update
     * @param  string  $fieldName  The field to increment
     * @param  int  $incrementBy  The amount to increment by (default: 1)
     * @return array<mixed> The update operation result
     */
    public function incrementDocumentField(string $indexName, string $documentId, string $fieldName, int $incrementBy = 1): array
    {
        $index = $this->client->index($indexName);

        $function = <<<RHAI
if (doc.{$fieldName} == null) {
    doc.{$fieldName} = {$incrementBy};
} else {
    doc.{$fieldName} += {$incrementBy};
}

if (doc.usage_count == null) {
    doc.usage_count = 1;
} else {
    doc.usage_count += 1;
}

doc.last_used_at = last_used_at;
RHAI;

        $result = $index->updateDocumentsByFunction(
            $function,
            [
                'filter' => "id = '{$documentId}'",
                'context' => [
                    'last_used_at' => now()->toISOString(),
                ],
            ]
        );

        return is_array($result) ? $result : [];
    }

    /**
     * Track institution usage by incrementing popularity and updating usage metadata
     *
     * @param  string  $institutionId  The ID of the institution
     * @return array<mixed> The tracking result with success status and updated data
     */
    public function trackInstitutionUsage(string $institutionId): array
    {
        try {
            // Increment the popularity field for the institution
            $result = $this->incrementDocumentField('institutions', $institutionId, 'popularity', 1);

            // At this point, the update is enqueued in Meilisearch.
            // We can assume success for the purpose of the response.
            return [
                'success' => true,
                'message' => 'Institution usage tracking has been updated.',
                'task_id' => $result['taskUid'] ?? null,
                'institution_id' => $institutionId,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'An error occurred while tracking institution usage.',
                'error' => $e->getMessage(),
                'institution_id' => $institutionId,
            ];
        }
    }
}
