<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\MeilisearchService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

final class ProcessInstitutionLogos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Maximum width for institution logos
     */
    private const int MAX_WIDTH = 300;

    /**
     * Maximum height for institution logos
     */
    private const int MAX_HEIGHT = 300;

    /**
     * Cache TTL in seconds (1 week)
     */
    private const int CACHE_TTL = 604800;

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
     * Check if logo exists locally and return the URL if it does
     *
     * @param  string  $folder  Local storage folder
     * @param  string  $id  Institution ID
     * @return string|null Logo URL if exists, null otherwise
     */
    public static function getLogoFromLocal(string $folder, string $id): ?string
    {
        try {
            $cacheKey = "institution_logo:{$folder}:{$id}";

            /** @var string|null */
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($folder, $id) {
                $path = "{$folder}/{$id}.png";

                if (Storage::exists($path)) {
                    Log::info("Logo for {$id} already exists locally");

                    return Storage::url($path);
                }

                return null;
            });
        } catch (Exception $e) {
            Log::warning("Error checking if logo {$id} exists: {$e->getMessage()}");

            return null;
        }
    }

    /**
     * Upload a logo to local storage
     *
     * @param  string  $id  The institution ID
     * @param  string  $imageUrl  The image URL to upload
     * @param  string  $folder  The storage folder
     * @return string The logo URL or empty string
     */
    public static function uploadLogo(string $id, string $imageUrl, string $folder): string
    {
        try {
            // Use concurrent requests for faster image fetching
            $response = Http::timeout(10)->get($imageUrl);

            if ($response->successful() && str_contains($response->header('Content-Type'), 'image')) {
                // Process and optimize the image
                $image = Image::read($response->body());

                // Resize if needed while maintaining aspect ratio
                if ($image->width() > self::MAX_WIDTH || $image->height() > self::MAX_HEIGHT) {
                    $image->resize(self::MAX_WIDTH, self::MAX_HEIGHT);
                }

                // Ensure directory exists
                Storage::makeDirectory($folder);

                // Store the image
                $filename = "{$id}.png";
                $fullPath = "{$folder}/{$filename}";

                if (Storage::put($fullPath, $image->toPng()->toFilePointer())) {
                    Log::info("Uploaded new logo for {$id} to local storage");

                    $url = Storage::url($fullPath);

                    // Cache the URL
                    Cache::put("institution_logo:{$folder}:{$id}", $url, self::CACHE_TTL);

                    return $url;
                }
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

    /**
     * Execute the job.
     */
    public function handle(MeilisearchService $meilisearch): void
    {
        $readyToIndex = [];
        $processedCount = 0;
        $existingCount = 0;

        // Process institutions in parallel batches
        Collection::make($this->batch)
            ->chunk(10)
            ->each(function ($chunk) use (&$readyToIndex, &$processedCount, &$existingCount): void {
                $jobs = $chunk->map(fn ($institution): ProcessSingleInstitutionLogo => new ProcessSingleInstitutionLogo($institution));

                // Process jobs immediately
                foreach ($jobs as $job) {
                    $output = $job->handle();

                    if ($output && isset($output['logo'])) {
                        $readyToIndex[] = $output;
                        if ($job->wasExisting) {
                            $existingCount++;
                        } else {
                            $processedCount++;
                        }
                    }
                }
            });

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
}
