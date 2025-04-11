<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\CurrencyHandler;
use App\Data\Currency\ArgentinaResponseData;
use App\Data\Currency\CodesResponseData;
use App\Data\Currency\LatestResponseData;
use App\Data\Currency\VenezuelaResponseData;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class CurrencyService implements CurrencyHandler
{
    /**
     * Create a new instance of the Currency service.
     */
    public function __construct(
        private ?string $apiKey = null,
        private ?string $baseUrl = null,
    ) {
        $this->apiKey = type(config('services.currency_api.key'))->asString();
        $this->baseUrl = type(config('services.currency_api.base_url'))->asString();
    }

    /**
     * Determine if the Currency Exchange Rate feature is enabled.
     */
    public function isEnabled(): bool
    {
        return filled($this->apiKey) && filled($this->baseUrl);
    }

    public function getCachedExchangeRate(string $baseCurrency, string $targetCurrency): ?float
    {
        $rates = $this->getCachedExchangeRates($baseCurrency, [$targetCurrency]);

        if (isset($rates[$targetCurrency])) {
            return (float) $rates[$targetCurrency];
        }

        return null;
    }

    public function getCachedExchangeRates(string $baseCurrency, array $targetCurrencies): ?array
    {
        return $this->getExchangeRates($baseCurrency, $targetCurrencies);
    }

    public function getExchangeRates(string $baseCurrency, array $targetCurrencies): ?array
    {
        $cacheKey = "currency_rates_{$baseCurrency}";
        /** @var array<string, float>|null $cachedRates */
        $cachedRates = Cache::get($cacheKey);

        if (Cache::missing($cacheKey)) {
            $cachedRates = $this->updateCurrencyRatesCache($baseCurrency);

            if ($cachedRates === null || $cachedRates === []) {
                return null;
            }
        }

        $filteredRates = array_intersect_key($cachedRates ?? [], array_flip($targetCurrencies));
        $filteredRates = array_filter($filteredRates);

        $filteredCurrencies = array_keys($filteredRates);
        $missingCurrencies = array_diff($targetCurrencies, $filteredCurrencies);

        if (filled($missingCurrencies)) {
            return null;
        }

        return $filteredRates;
    }

    public function updateCurrencyRatesCache(string $baseCurrency): ?array
    {
        try {
            $response = Http::get("{$this->baseUrl}/{$this->apiKey}/latest/{$baseCurrency}");

            if ($response->getStatusCode() === 200) {
                $responseData = LatestResponseData::from($response->json());

                if ($responseData->result === 'success' && isset($responseData->conversionRates)) {
                    $venezuelaDolarData = $this->getVenezuelaDolarData();
                    $argentinaDolarData = $this->getArgentinaDolarData();

                    if ($venezuelaDolarData instanceof VenezuelaResponseData) {
                        $responseData->conversionRates['VES'] = $venezuelaDolarData->result[0]->promEpv;
                    }

                    if ($argentinaDolarData instanceof ArgentinaResponseData) {
                        $responseData->conversionRates['ARS'] = $argentinaDolarData->blue->valueAvg;
                    }

                    Cache::put("currency_rates_{$baseCurrency}", $responseData->conversionRates, now()->addHours(12));

                    return $responseData->conversionRates;
                }

                Log::error('API response does not contain rates data', [
                    'status_code' => $response->getStatusCode(),
                    'response_body' => $response->getBody()->getContents(),
                ]);
            } else {
                Log::error('Failed to retrieve exchange rates from Currency API', [
                    'status_code' => $response->getStatusCode(),
                    'response_body' => $response->getBody()->getContents(),
                ]);
            }
        } catch (GuzzleException $e) {
            Log::error('Failed to retrieve exchange rates from Currency API', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
        }

        return null;
    }

    public function getSupportedCurrencies(): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        /** @var array<string>|null */
        return Cache::remember('supported_currency_codes', now()->addMonth(), function (): ?array {
            $response = Http::get("{$this->baseUrl}/{$this->apiKey}/codes");

            if ($response->getStatusCode() === 200) {
                $responseData = CodesResponseData::from($response->json());

                if ($responseData->result === 'success' && filled($responseData->supportedCodes)) {
                    return array_column($responseData->supportedCodes, 0);
                }
            }

            Log::error('Failed to retrieve supported currencies from Currency API', [
                'status_code' => $response->getStatusCode(),
                'response_body' => $response->getBody()->getContents(),
            ]);

            return null;
        });
    }

    /**
     * Get the Venezuela dolar data from the external API.
     * This is an special case because Venezuela have a lot of different dolar prices.
     * So, for better rates for the user we use the black market dolar data.
     *
     * This is safe to delete it if you don't want to support black market dolar data.
     */
    private function getVenezuelaDolarData(): ?VenezuelaResponseData
    {
        try {
            $response = Http::withHeader('Origin', 'https://monitordolarvenezuela.com')
                ->get('https://api.monitordolarvenezuela.com/dolarhoy')
                ->json();

            /** @var VenezuelaResponseData|null */
            return Cache::remember('venezuela_dolar_data', now()->addHours(6), fn (): VenezuelaResponseData => VenezuelaResponseData::from($response));
        } catch (Throwable $e) {
            Log::error('Error retrieving Venezuela dolar data', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get the Argentina dolar data from the external API.
     * This is an special case because Argentina have a lot of different dolar prices.
     * So, for better rates for the user we use the black market dolar data.
     *
     * This is safe to delete it if you don't want to support black market dolar data.
     */
    private function getArgentinaDolarData(): ?ArgentinaResponseData
    {
        try {
            $response = Http::get('https://api.bluelytics.com.ar/v2/latest');

            if ($response->successful()) {
                /** @var ArgentinaResponseData|null */
                return Cache::remember('argentina_dolar_data', now()->addHours(6), fn (): ArgentinaResponseData => ArgentinaResponseData::from($response->json()));
            }

            Log::error('Failed to retrieve Argentina dolar data', [
                'status_code' => $response->status(),
                'response' => $response->json(),
            ]);

            return null;
        } catch (Throwable $e) {
            Log::error('Error retrieving Argentina dolar data', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
