<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Changelog;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
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
                ->add(Url::create('/')->setLastModificationDate(Carbon::now()))
                ->add(Url::create('/pricing')->setLastModificationDate(Carbon::now()))
                ->add(Url::create('/login')->setLastModificationDate(Carbon::now()))
                ->add(Url::create('/register')->setLastModificationDate(Carbon::now()))
                ->add(Url::create('/changelog')->setLastModificationDate(Carbon::now()))
                ->add(Changelog::published()->get())
                ->add(Url::create('/terms-of-service')->setLastModificationDate(Carbon::now()))
                ->add(Url::create('/privacy-policy')->setLastModificationDate(Carbon::now()))
                ->writeToFile(public_path('sitemap.xml'));

            $this->info('Sitemap generated successfully.');
        } catch (Throwable $th) {
            $this->error($th->getMessage());
        }
    }
}
