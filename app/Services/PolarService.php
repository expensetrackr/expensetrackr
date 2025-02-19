<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\PolarApiError;
use Illuminate\Support\Facades\Http;

final class PolarService
{
    public const string VERSION = '0.0.1';

    /**
     * Perform a Polar.sh API call.
     *
     * @return array<string, mixed>
     *
     * @throws Exception
     * @throws PolarApiError
     */
    public static function api(string $method, string $uri, array $payload = []): array
    {
        if (empty($apiKey = config('services.polar.api_key'))) {
            throw new Exception('Polar.sh API key not set.');
        }

        $apiUrl = config('services.polar.api_url', 'https://sandbox-api.polar.sh/v1');

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withToken($apiKey)
            ->accept('application/json')
            ->contentType('application/json')
            ->withUserAgent('Polar.sh\Laravel\ExpenseTracker/'.self::VERSION)
            ->$method($apiUrl."/{$uri}".'/', $payload);

        if ($response->notFound()) {
            throw new PolarApiError($response['error']['detail'], 404);
        }

        if ($response->status() === 422) {
            throw new PolarApiError($response['detail'][0]['msg'], 422);
        }

        if ($response->failed()) {
            throw new PolarApiError($response['error']['detail'], $response->status());
        }

        return $response->json();
    }
}
