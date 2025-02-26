<?php

declare(strict_types=1);

namespace App\Services;

use MeiliSearch\Client;

final class MeilisearchService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key')
        );
    }

    /**
     * Add documents to a specified index
     */
    public function addDocuments(string $indexName, array $documents): array
    {
        $index = $this->client->index($indexName);

        return $index->addDocuments($documents);
    }

    /**
     * Add or replace documents in an index
     */
    public function updateDocuments(string $indexName, array $documents): array
    {
        $index = $this->client->index($indexName);

        return $index->updateDocuments($documents);
    }

    /**
     * Set specific settings for an index
     */
    public function updateSettings(string $indexName, array $settings): void
    {
        $index = $this->client->index($indexName);

        if (isset($settings['searchableAttributes'])) {
            $index->updateSearchableAttributes($settings['searchableAttributes']);
        }

        if (isset($settings['filterableAttributes'])) {
            $index->updateFilterableAttributes($settings['filterableAttributes']);
        }

        if (isset($settings['sortableAttributes'])) {
            $index->updateSortableAttributes($settings['sortableAttributes']);
        }

        if (isset($settings['rankingRules'])) {
            $index->updateRankingRules($settings['rankingRules']);
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
}
