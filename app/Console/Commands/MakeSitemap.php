<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Throwable;

final class MakeSitemap extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'make:sitemap';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            Sitemap::create()
                ->add('/')
                ->add('/terms-of-service')
                ->add('/privacy-policy')
                ->add('/login')
                ->add('/register')
                ->writeToFile(public_path('sitemap.xml'));

            $this->info('Sitemap generated successfully.');
        } catch (Throwable $th) {
            $this->error($th->getMessage());
        }
    }
}
