<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

final class FlushVenezuelaDolarCache extends Command
{
    protected $signature = 'cache:flush-venezuela-dolar';

    protected $description = 'Flush the Venezuela dolar cache';

    public function handle(): void
    {
        Cache::forget('venezuela_dolar_data');
        $this->info('Venezuela dolar cache has been flushed.');
    }
}
