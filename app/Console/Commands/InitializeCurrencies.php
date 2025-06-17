<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Akaunting\Money\Currency;
use App\Facades\Forex;
use App\Models\CurrencyList;
use Illuminate\Console\Command;

final class InitializeCurrencies extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'currency:init';

    /**
     * The console command description.
     */
    protected $description = 'Initialize currencies from the API';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Fetching supported currencies from the API...');

        $apiSupportedCurrencies = Forex::getSupportedCurrencies();

        if (Forex::isDisabled()) {
            $this->error('The Currency Exchange Rate feature is disabled.');

            return;
        }

        if ($apiSupportedCurrencies === null || $apiSupportedCurrencies === []) {
            $this->error('Failed to fetch supported currencies from the API.');

            return;
        }

        $appSupportedCurrencies = array_keys(Currency::getCurrencies());

        foreach ($appSupportedCurrencies as $appSupportedCurrency) {
            $isAvailable = in_array($appSupportedCurrency, $apiSupportedCurrencies, true);
            $currencyAttributes = [
                'code' => $appSupportedCurrency,
                'name' => currency($appSupportedCurrency)->getName(),
                'available' => $isAvailable,
            ];

            CurrencyList::updateOrCreate(
                ['code' => $appSupportedCurrency],
                $currencyAttributes
            );
        }

        $this->info('Successfully initialized currencies.');
    }
}
