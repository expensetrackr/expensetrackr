<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\Polar\PolarError;
use App\Exceptions\PolarApiError;
use Exception;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Http;
use Polar\Models\Components;
use Polar\Models\Errors;
use Polar\Polar;

final class PolarService
{
    public const string VERSION = '0.0.1';

    /**
     * Perform a Polar.sh API call.
     *
     * @param  array<string, mixed>  $payload
     *
     * @throws Exception
     * @throws PolarApiError
     */
    public static function api(string $method, string $uri, array $payload = []): mixed
    {
        $apiKey = config('services.polar.api_key');

        if (empty($apiKey) || ! is_string($apiKey)) {
            throw new Exception('Polar.sh API key not set or invalid.');
        }

        /** @var string */
        $apiUrl = config('services.polar.api_url', 'https://sandbox-api.polar.sh/v1');

        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withToken($apiKey)
            ->accept('application/json')
            ->contentType('application/json')
            ->withUserAgent('Polar.sh\Laravel\ExpenseTracker/'.self::VERSION)
            ->$method($apiUrl.'/'.$uri, $payload);

        if ($response->notFound()) {
            throw new PolarApiError('Not found', 404);
        }

        if ($response->failed()) {
            $error = PolarError::from($response->json());
            throw new PolarApiError($error->detail->first()->msg ?? 'Unknown error', $response->status());
        }

        return $response->json() ?? [];
    }

    /**
     * Create a checkout session.
     *
     * @throws PolarApiError
     */
    public function createCheckoutSession(Components\CheckoutProductsCreate $request): ?Components\Checkout
    {
        try {
            $responses = $this->sdk()->checkouts->create(request: $request);

            return $responses->checkout;
        } catch (Errors\APIException $e) {
            throw new PolarApiError($e->getMessage(), 400);
        }
    }

    /**
     * Update a subscription.
     *
     * @throws PolarApiError
     */
    public function updateSubscription(string $subscriptionId, Components\SubscriptionUpdateProduct|Components\SubscriptionCancel $request): ?Components\Subscription
    {
        try {
            $responses = $this->sdk()->subscriptions->update(id: $subscriptionId, subscriptionUpdate: $request);

            return $responses->subscription;
        } catch (Errors\APIException $e) {
            throw new PolarApiError($e->getMessage(), 400);
        }
    }

    /**
     * Create a customer session.
     *
     * @throws PolarApiError
     */
    public function createCustomerSession(Components\CustomerSessionCreate $request): ?Components\CustomerSession
    {
        try {
            $responses = $this->sdk()->customerSessions->create(request: $request);

            return $responses->customerSession;
        } catch (Errors\APIException $e) {
            throw new PolarApiError($e->getMessage(), 400);
        }
    }

    /**
     * Get the Polar SDK instance.
     *
     * @throws BindingResolutionException
     */
    private function sdk(): Polar
    {
        return Polar::builder()
            ->setSecurity(type(config('services.polar.api_key'))->asString())
            ->setServer(app()->environment('production') ? 'production' : 'sandbox')
            ->build();
    }
}
