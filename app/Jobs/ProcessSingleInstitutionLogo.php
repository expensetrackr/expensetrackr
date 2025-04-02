<?php

declare(strict_types=1);

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class ProcessSingleInstitutionLogo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public $timeout = 30;

    /**
     * Whether the logo already existed
     */
    public bool $wasExisting = false;

    /**
     * Create a new job instance.
     *
     * @param  array<string, mixed>  $institution  The institution data to process
     */
    public function __construct(
        private array $institution
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): ?array
    {
        try {
            if (! isset($this->institution['id']) ||
                ! isset($this->institution['folder']) ||
                ! isset($this->institution['imageUrl'])) {
                Log::warning('Invalid institution data', ['institution' => $this->institution]);

                return null;
            }

            // Ensure we have string values
            $id = is_scalar($this->institution['id']) ? (string) $this->institution['id'] : '';
            $folder = is_scalar($this->institution['folder']) ? (string) $this->institution['folder'] : '';
            $imageUrl = is_scalar($this->institution['imageUrl']) ? (string) $this->institution['imageUrl'] : '';

            if ($id === '' || $folder === '' || $imageUrl === '') {
                Log::warning('Invalid institution data values', ['institution' => $this->institution]);

                return null;
            }

            // First check if logo already exists locally
            $existingLogo = ProcessInstitutionLogos::getLogoFromLocal($folder, $id);

            if ($existingLogo !== null && $existingLogo !== '' && $existingLogo !== '0') {
                // Logo already exists, use the existing URL
                $this->institution['logo'] = $existingLogo;
                $this->wasExisting = true;
            } else {
                // Logo doesn't exist, try to upload it
                $logoUrl = ProcessInstitutionLogos::uploadLogo($id, $imageUrl, $folder);

                if ($logoUrl !== '' && $logoUrl !== '0') {
                    $this->institution['logo'] = $logoUrl;
                    $this->wasExisting = false;
                }
            }

            // Remove processing fields before adding to Meilisearch
            unset($this->institution['imageUrl']);
            unset($this->institution['folder']);

            return $this->institution;
        } catch (Exception $e) {
            $institutionId = isset($this->institution['id']) ? is_scalar($this->institution['id']) ? (string) $this->institution['id'] : 'unknown' : 'unknown';

            Log::error("Error processing institution: {$institutionId}", [
                'error' => $e->getMessage(),
                'institution' => $institutionId,
            ]);

            return null;
        }
    }
}
