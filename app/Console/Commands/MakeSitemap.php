<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;

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
     *
     * @return mixed
     */
    public function handle()
    {
        Sitemap::create()
            ->add('/')
            ->add('/terms-of-service')
            ->add('/privacy-policy')
            ->writeToFile(public_path('sitemap.xml'));
    }
}
