<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\Synth\SynthEnrichData;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final readonly class SynthService
{
    private const int CACHE_TTL = 3600; // 1 hour

    private string $baseUrl;

    private string $accessToken;

    public function __construct()
    {
        $this->accessToken = config('services.synth.access_token');
        $this->baseUrl = config('services.synth.base_url');
    }

    public function enrichTransaction(string $description, ?string $categoryHint = ''): ?SynthEnrichData
    {
        $cacheKey = "synth_enrich:{$description}:{$categoryHint}";

        try {
            // Check cache first
            if ($cached = Cache::get($cacheKey)) {
                Log::info('Retrieved enrichment data from cache', [
                    'description' => $description,
                    'category_hint' => $categoryHint,
                ]);

                return SynthEnrichData::from($cached);
            }

            $response = $this->request('GET', "/enrich?description=$description&category_hint=$categoryHint");
            $response = json_decode($response, true);

            if (! isset($response['merchant'])) {
                Log::warning('Invalid response from Synth API', [
                    'description' => $description,
                    'category_hint' => $categoryHint,
                    'response' => $response,
                ]);

                return null;
            }

            // Cache successful responses
            Cache::put($cacheKey, $response, self::CACHE_TTL);

            return SynthEnrichData::from($response);
        } catch (GuzzleException $e) {
            Log::error('Synth API request failed', [
                'description' => $description,
                'category_hint' => $categoryHint,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            return null;
        } catch (Exception $e) {
            Log::error('Error enriching transaction', [
                'description' => $description,
                'category_hint' => $categoryHint,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Make a request to the Synth API.
     *
     * @param  ?array<array-key, mixed>  $data
     *
     * @throws GuzzleException
     */
    private function request(string $method, string $path, ?array $data = null): string
    {
        $url = "{$this->baseUrl}$path";
        $headers = [
            'Authorization' => "Bearer {$this->accessToken}",
            'Accept' => 'application/json',
        ];

        $client = new Client([
            'timeout' => 10,
            'connect_timeout' => 5,
        ]);

        $response = $client->request($method, $url, [
            'headers' => $headers,
            'json' => $data,
        ]);

        return $response->getBody()->getContents();
    }
}
