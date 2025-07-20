<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

final class ScribeGenerateDocs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scribe:generate:docs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate API documentation and move the files to public/docs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating API documentation...');

        Artisan::call('scribe:generate');

        $this->info('Moving files to public/docs...');

        $files = Storage::disk('local')->files('scribe');

        $this->info('Found '.count($files).' files to move...');

        // Ensure the public docs directory exists
        $docsPath = public_path('docs');
        if (! File::exists($docsPath)) {
            File::makeDirectory($docsPath, 0755, true);
        }

        foreach ($files as $file) {
            // Get the file content from local storage
            $content = Storage::disk('local')->get($file);

            // Extract filename from the path (e.g., 'scribe/openapi.yaml' -> 'openapi.yaml')
            $filename = basename($file);

            // Write to public/docs directory
            File::put("$docsPath/$filename", $content);
        }

        $this->info('Removing local files...');

        foreach ($files as $file) {
            Storage::disk('local')->delete($file);
        }

        $this->info('Done!');
    }
}
