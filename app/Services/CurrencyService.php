<?php

declare(strict_types=1);

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final readonly class CurrencyService
{
    public function __construct(
        protected ?string $apiKey,
        protected ?string $baseUrl,
        protected Client $client
    ) {}

    /**
     * Determine if the Currency Exchange Rate feature is enabled.
     */
    public function isEnabled(): bool
    {
        return filled($this->apiKey) && filled($this->baseUrl);
    }

    /**
     * Get the supported currencies.
     */
    public function getSupportedCurrencies(): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        return Cache::remember('supported_currency_codes', now()->addMonth(), function () {
            $response = $this->client->get("{$this->baseUrl}/currencies", [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                $responseData = json_decode($response->getBody()->getContents(), true);

                if (filled($responseData['data'])) {
                    return array_map(function ($currency) {
                        if ($currency['iso_code'] === 'veb') {
                            return 'VES';
                        }

                        return mb_strtoupper($currency['iso_code']);
                    }, $responseData['data']);
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
     * Get the exchange rates for the given base currency and target currencies.
     */
    public function getExchangeRates(string $baseCurrency, array $targetCurrencies): ?array
    {
        $cacheKey = "currency_rates_{$baseCurrency}";
        $cachedRates = Cache::get($cacheKey);

        if (Cache::missing($cachedRates)) {
            $cachedRates = $this->updateCurrencyRatesCache($baseCurrency);

            if (empty($cachedRates)) {
                return null;
            }
        }

        $filteredRates = array_intersect_key($cachedRates, array_flip($targetCurrencies));
        $filteredRates = array_filter($filteredRates);

        $filteredCurrencies = array_keys($filteredRates);
        $missingCurrencies = array_diff($targetCurrencies, $filteredCurrencies);

        if (filled($missingCurrencies)) {
            return null;
        }

        return $filteredRates;
    }

    /**
     * Get the cached exchange rates for the given base currency and target currencies.
     */
    public function getCachedExchangeRates(string $baseCurrency, array $targetCurrencies): ?array
    {
        if ($this->isEnabled()) {
            return $this->getExchangeRates($baseCurrency, $targetCurrencies);
        }

        return null;
    }

    /**
     * Get the cached exchange rate for the given base currency and target currency.
     */
    public function getCachedExchangeRate(string $baseCurrency, string $targetCurrency): ?float
    {
        $rates = $this->getCachedExchangeRates($baseCurrency, [$targetCurrency]);

        if (isset($rates[$targetCurrency])) {
            return (float) $rates[$targetCurrency];
        }

        return null;
    }

    /**
     * Update the currency rates cache for the given base currency.
     */
    public function updateCurrencyRatesCache(string $baseCurrency): ?array
    {
        try {
            $currencies = implode(',', $this->getSupportedCurrencies());
            $response = $this->client->get("{$this->baseUrl}/rates/live?from={$baseCurrency}&to={$currencies}", [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                $responseData = json_decode($response->getBody()->getContents(), true);

                if (isset($responseData['data']['rates'])) {
                    Cache::put("currency_rates_{$baseCurrency}", $responseData['data']['rates'], now()->addDay());

                    return $responseData['data']['rates'];
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
}
