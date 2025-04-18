<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

final class FlushVenezuelaDollarCache extends Command
{
    protected $signature = 'cache:flush-venezuela-dollar';

    protected $description = 'Flush the Venezuela dollar cache';

    public function handle(): void
    {
        Cache::forget('venezuela_dollar_data');
        $this->info('Venezuela dollar cache has been flushed.');
    }
}
