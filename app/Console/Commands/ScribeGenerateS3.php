<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

final class ScribeGenerateS3 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scribe:generate:s3';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate API documentation and move the files to S3 bucket';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating API documentation...');

        Artisan::call('scribe:generate');

        $this->info('Moving files to S3 bucket...');

        $files = Storage::disk('local')->files('scribe');

        $this->info('Found '.count($files).' files to move...');

        foreach ($files as $file) {
            Storage::disk('s3')->put($file, Storage::disk('local')->get($file));
        }

        $this->info('Removing local files...');

        foreach ($files as $file) {
            Storage::disk('local')->delete($file);
        }

        $this->info('Done!');
    }
}
