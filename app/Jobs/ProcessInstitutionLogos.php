<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\MeilisearchService;
use Cloudinary\Api\Upload\UploadApi;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class ProcessInstitutionLogos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 120;

    /**
     * Create a new job instance.
     *
     * @param  array<int, array<string, mixed>>  $batch  The batch of institutions to process
     */
    public function __construct(
        private array $batch
    ) {}

    /**
     * Execute the job.
     */
    public function handle(MeilisearchService $meilisearch): void
    {
        $readyToIndex = [];
        $processedCount = 0;
        $existingCount = 0;

        foreach ($this->batch as $institution) {
            try {
                if (! isset($institution['id']) ||
                    ! isset($institution['folder']) ||
                    ! isset($institution['imageUrl'])) {
                    Log::warning('Invalid institution data', ['institution' => $institution]);

                    continue;
                }

                // Ensure we have string values
                $id = is_scalar($institution['id']) ? (string) $institution['id'] : '';
                $folder = is_scalar($institution['folder']) ? (string) $institution['folder'] : '';
                $imageUrl = is_scalar($institution['imageUrl']) ? (string) $institution['imageUrl'] : '';

                if ($id === '' || $folder === '' || $imageUrl === '') {
                    Log::warning('Invalid institution data values', ['institution' => $institution]);

                    continue;
                }

                // First check if logo already exists in Cloudinary
                $existingLogo = $this->getLogoFromCloudinary($folder, $id);

                if ($existingLogo !== null && $existingLogo !== '' && $existingLogo !== '0') {
                    // Logo already exists, use the existing URL
                    $institution['logo'] = $existingLogo;
                    $existingCount++;
                } else {
                    // Logo doesn't exist, try to upload it
                    $logoUrl = $this->uploadLogo($id, $imageUrl, $folder);

                    if ($logoUrl !== '' && $logoUrl !== '0') {
                        $institution['logo'] = $logoUrl;
                        $processedCount++;
                    }
                }

                // Remove processing fields before adding to Meilisearch
                unset($institution['imageUrl']);
                unset($institution['folder']);

                // Only add to index if we have a logo
                if (isset($institution['logo']) && ! empty($institution['logo'])) {
                    $readyToIndex[] = $institution;
                }
            } catch (Exception $e) {
                $institutionId = '';
                if (isset($institution['id'])) {
                    $institutionId = is_scalar($institution['id']) ? (string) $institution['id'] : 'unknown';
                } else {
                    $institutionId = 'unknown';
                }

                Log::error("Error processing institution: {$institutionId}", [
                    'error' => $e->getMessage(),
                    'institution' => $institutionId,
                ]);

                // Continue processing other items in batch
                continue;
            }
        }

        // Update Meilisearch with institutions that have logos
        if ($readyToIndex !== []) {
            try {
                $meilisearch->addDocuments('institutions', $readyToIndex);
                Log::info('Updated '.count($readyToIndex)." institutions in Meilisearch with logos (existing: {$existingCount}, new: {$processedCount})");
            } catch (Exception $e) {
                Log::error("Failed to update Meilisearch: {$e->getMessage()}");
            }
        }

        Log::info('Completed processing batch of '.count($this->batch).' institutions, added '.count($readyToIndex).' logos to Meilisearch');
    }

    /**
     * Check if logo exists in Cloudinary and return the URL if it does
     *
     * @param  string  $folder  Cloudinary folder
     * @param  string  $id  Institution ID
     * @return string|null Logo URL if exists, null otherwise
     */
    private function getLogoFromCloudinary(string $folder, string $id): ?string
    {
        try {
            $baseUrl = config('services.public_assets.url');
            $baseUrlString = is_string($baseUrl) ? $baseUrl : '';

            $cloudinaryUrl = $baseUrlString."/{$folder}/{$id}";
            $response = Http::head($cloudinaryUrl);

            $contentType = $response->header('Content-Type');
            if ($response->successful() && $contentType && str_contains($contentType, 'image')) {
                Log::info("Logo for {$id} already exists in Cloudinary");

                return $cloudinaryUrl;
            }

            return null;
        } catch (Exception $e) {
            Log::warning("Error checking if logo {$id} exists: {$e->getMessage()}");

            return null;
        }
    }

    /**
     * Upload a logo to Cloudinary
     *
     * @param  string  $id  The institution ID
     * @param  string  $imageUrl  The image URL to upload
     * @param  string  $folder  The Cloudinary folder
     * @return string The logo URL or empty string
     */
    private function uploadLogo(string $id, string $imageUrl, string $folder): string
    {
        try {
            // Verify the source image exists
            $response = Http::head($imageUrl);

            $contentType = $response->header('Content-Type');
            if ($response->successful() && $contentType && str_contains($contentType, 'image')) {
                // Upload to Cloudinary
                $uploadResult = (new UploadApi())->upload($imageUrl, [
                    'public_id' => $id,
                    'folder' => $folder,
                ]);
                $uploadResult = $uploadResult->getArrayCopy();

                Log::info("Uploaded new logo for {$id} to Cloudinary");

                $url = $uploadResult['url'];

                return $url ?: '';
            }

            Log::warning("Source image for {$id} is not valid", [
                'status' => $response->status(),
                'content_type' => $response->header('Content-Type'),
            ]);

            return '';
        } catch (Exception $e) {
            Log::error("Error uploading logo for {$id}: {$e->getMessage()}");

            return '';
        }
    }
}
