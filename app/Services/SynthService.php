<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\Synth\SynthEnrichData;
use GuzzleHttp\Client;

final readonly class SynthService
{
    private string $baseUrl;

    private string $accessToken;

    public function __construct()
    {
        $this->accessToken = config('services.synth.access_token');
        $this->baseUrl = config('services.synth.base_url');
    }

    public function enrichTransaction(string $description, ?string $categoryHint = ''): ?SynthEnrichData
    {
        $response = $this->request('GET', "/enrich?description=$description&category_hint=$categoryHint");

        $response = json_decode($response, true);

        if (! isset($response['merchant'])) {
            return null;
        }

        return SynthEnrichData::from($response);
    }

    /**
     * Make a request to the Synth API.
     *
     * @param  ?array<array-key, mixed>  $data
     * @return \Psr\Http\Message\StreamInterface
     */
    private function request(string $method, string $path, ?array $data = null): bool|string
    {
        $url = "{$this->baseUrl}$path";
        $headers = [
            'Authorization' => "Bearer {$this->accessToken}",
            'Accept' => 'application/json',
        ];

        $client = new Client();

        $response = $client->request($method, $url, [
            'headers' => $headers,
            'json' => $data,
        ]);

        return $response->getBody()->getContents();
    }
}
