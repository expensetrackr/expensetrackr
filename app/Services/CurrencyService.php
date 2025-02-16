<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\CurrencyHandler;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final readonly class CurrencyService implements CurrencyHandler
{
    /**
     * Create a new instance of the Currency service.
     */
    public function __construct(
        private ?string $apiKey,
        private ?string $baseUrl,
        private Client $client
    ) {
        //
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
            $currencies = implode(',', $this->getSupportedCurrencies());
            $response = $this->client->get("{$this->baseUrl}/rates/live?from={$baseCurrency}&to={$currencies}", [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                /**
                 * @var array{
                 *     data: array{
                 *         date: string,
                 *         time: string,
                 *         source: string,
                 *         rates: array<string, float>|null
                 *     },
                 *     meta: array{
                 *         total_records: int,
                 *         credits_used: int,
                 *         credits_remaining: int
                 *     }
                 * } $responseData
                 */
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

    public function getSupportedCurrencies(): ?array
    {
        if (! $this->isEnabled()) {
            return null;
        }

        /** @var array<string>|null */
        return Cache::remember('supported_currency_codes', now()->addMonth(), function (): ?array {
            $response = $this->client->get("{$this->baseUrl}/currencies", [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                /**
                 * @var array{data: array<int, array{
                 *     iso_code: string,
                 *     iso_numeric: int,
                 *     name: string,
                 *     country: string,
                 *     symbol: string,
                 *     symbol_alternatives: array<int, string>,
                 *     disambiguated_symbol: string|null,
                 *     decimal_character: string,
                 *     thousands_character: string
                 * }>, meta: array{
                 *     total_records: int,
                 *     credits_used: int,
                 *     credits_remaining: int
                 * }} $responseData
                 */
                $responseData = json_decode($response->getBody()->getContents(), true);

                if (filled($responseData['data'])) {
                    $excludedCodes = ['MRO', 'SKK', 'SLL', 'STD', 'XAG', 'XAU', 'XDR', 'XPD', 'XPT', 'XTS', 'ZMK'];

                    return array_values(array_map(function (array $currency): string {
                        if ($currency['iso_code'] === 'veb') {
                            return 'VES';
                        }

                        return mb_strtoupper($currency['iso_code']);
                    }, array_filter($responseData['data'], fn (array $currency): bool => ! in_array(mb_strtoupper($currency['iso_code']), $excludedCodes))));
                }
            }

            Log::error('Failed to retrieve supported currencies from Currency API', [
                'status_code' => $response->getStatusCode(),
                'response_body' => $response->getBody()->getContents(),
            ]);

            return null;
        });
    }

    public function isEnabled(): bool
    {
        return filled($this->apiKey) && filled($this->baseUrl);
    }
}
