<?php

declare(strict_types=1);

namespace App\Handlers;

use App\Concerns\Polar\Billable;
use App\Enums\Polar\OrderStatus;
use App\Events\Polar\BenefitGrantCreated;
use App\Events\Polar\BenefitGrantRevoked;
use App\Events\Polar\BenefitGrantUpdated;
use App\Events\Polar\OrderCreated;
use App\Events\Polar\OrderUpdated;
use App\Events\Polar\SubscriptionActive;
use App\Events\Polar\SubscriptionCanceled;
use App\Events\Polar\SubscriptionCreated;
use App\Events\Polar\SubscriptionRevoked;
use App\Events\Polar\SubscriptionUpdated;
use App\Exceptions\InvalidMetadataPayload;
use App\Models\Polar\Customer;
use App\Models\Polar\Order;
use App\Models\Polar\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Spatie\WebhookClient\Jobs\ProcessWebhookJob;

final class ProcessWebhook extends ProcessWebhookJob
{
    public function handle(): void
    {
        $decoded = json_decode($this->webhookCall, true);
        $payload = $decoded['payload'];
        $type = $payload['type'];
        $data = $payload['data'];

        match ($type) {
            'order.created' => $this->handleOrderCreated($data),
            'order.updated' => $this->handleOrderUpdated($data),
            'subscription.created' => $this->handleSubscriptionCreated($data),
            'subscription.updated' => $this->handleSubscriptionUpdated($data),
            'subscription.active' => $this->handleSubscriptionActive($data),
            'subscription.canceled' => $this->handleSubscriptionCanceled($data),
            'subscription.revoked' => $this->handleSubscriptionRevoked($data),
            'benefit_grant.created' => $this->handleBenefitGrantCreated($data),
            'benefit_grant.updated' => $this->handleBenefitGrantUpdated($data),
            'benefit_grant.revoked' => $this->handleBenefitGrantRevoked($data),
            default => Log::info($data['type']),
        };

        // Acknowledge you received the response
        http_response_code(200);
    }

    /**
     * Handle the order created event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleOrderCreated(array $payload): void
    {
        $billable = $this->resolveBillable($payload);

        $order = $billable->orders()->create([
            'polar_id' => $payload['id'],
            'status' => $payload['status'],
            'amount' => $payload['amount'],
            'tax_amount' => $payload['tax_amount'],
            'refunded_amount' => $payload['refunded_amount'],
            'refunded_tax_amount' => $payload['refunded_tax_amount'],
            'currency' => $payload['currency'],
            'billing_reason' => $payload['billing_reason'],
            'customer_id' => $payload['customer_id'],
            'product_id' => $payload['product_id'],
            'product_price_id' => $payload['product_price_id'],
            'ordered_at' => Carbon::make($payload['created_at']),
        ]);

        OrderCreated::dispatch($billable, $order, $payload);
    }

    /**
     * Handle the order updated event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleOrderUpdated(array $payload): void
    {
        $billable = $this->resolveBillable($payload);

        if (! ($order = $this->findOrder($payload['id'])) instanceof Order) {
            return;
        }

        $status = $payload['status'];
        $isRefunded = $status === OrderStatus::REFUNDED->value || $status === OrderStatus::PARTIALLY_REFUNDED->value;

        $order->sync([
            ...$payload,
            'status' => $status,
            'refunded_at' => $isRefunded ? Carbon::make($payload['refunded_at']) : null,
        ]);

        OrderUpdated::dispatch($billable, $order, $payload, $isRefunded);
    }

    /**
     * Handle the subscription created event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionCreated(array $payload): void
    {
        $metadata = $payload['metadata'];
        $billable = $this->resolveBillable($payload);

        $subscription = $billable->subscriptions()->create([
            'type' => $metadata['subscription_type'],
            'polar_id' => $payload['id'],
            'status' => $payload['status'],
            'product_id' => $payload['product_id'],
            'price_id' => $payload['price_id'],
            'current_period_end' => $payload['current_period_end'] ? Carbon::make($payload['current_period_end']) : null,
            'ends_at' => $payload['ends_at'] ? Carbon::make($payload['ends_at']) : null,
        ]);

        // Set the billable's lemon squeezy id if it was on generic trial at the model level
        if (is_null($billable->customer->polar_id)) {
            $billable->customer->update(['polar_id' => $payload['customer_id']]);
        }

        SubscriptionCreated::dispatch($billable, $subscription, $payload);
    }

    /**
     * Handle the subscription updated event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionUpdated(array $payload): void
    {
        if (! ($subscription = $this->findSubscription($payload['id'])) instanceof Subscription) {
            return;
        }

        $subscription->sync($payload);

        if ($subscription->billable) {
            SubscriptionUpdated::dispatch($subscription->billable, $subscription, $payload);
        }
    }

    /**
     * Handle the subscription active event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionActive(array $payload): void
    {
        if (! ($subscription = $this->findSubscription($payload['id'])) instanceof Subscription) {
            return;
        }

        $subscription->sync($payload);

        if ($subscription->billable) {
            SubscriptionActive::dispatch($subscription->billable, $subscription, $payload);
        }
    }

    /**
     * Handle the subscription canceled event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionCanceled(array $payload): void
    {
        if (! ($subscription = $this->findSubscription($payload['id'])) instanceof Subscription) {
            return;
        }

        $subscription->sync($payload);

        if ($subscription->billable) {
            SubscriptionCanceled::dispatch($subscription->billable, $subscription, $payload);
        }
    }

    /**
     * Handle the subscription revoked event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionRevoked(array $payload): void
    {
        if (! ($subscription = $this->findSubscription($payload['id'])) instanceof Subscription) {
            return;
        }

        $subscription->sync($payload);

        if ($subscription->billable) {
            SubscriptionRevoked::dispatch($subscription->billable, $subscription, $payload);
        }
    }

    /**
     * Handle the benefit grant created event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleBenefitGrantCreated(array $payload): void
    {
        $billable = $this->resolveBillable($payload);

        BenefitGrantCreated::dispatch($billable, $payload);
    }

    /**
     * Handle the benefit grant updated event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleBenefitGrantUpdated(array $payload): void
    {
        $billable = $this->resolveBillable($payload);

        BenefitGrantUpdated::dispatch($billable, $payload);
    }

    /**
     * Handle the benefit grant revoked event.
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleBenefitGrantRevoked(array $payload): void
    {
        $billable = $this->resolveBillable($payload);

        BenefitGrantRevoked::dispatch($billable, $payload);
    }

    /**
     * Resolve the billable from the payload.
     *
     * @param  array<string, mixed>  $payload
     *
     * @throws InvalidMetadataPayload
     */
    private function resolveBillable(array $payload): Billable
    {
        $metadata = $payload['data']['metadata'] ?? null;

        if (! isset($metadata) || ! is_array($metadata) || ! isset($metadata['billable_id'], $metadata['billable_type'])) {
            throw new InvalidMetadataPayload();
        }

        return $this->findOrCreateCustomer(
            $metadata['billable_id'],
            (string) $metadata['billable_type'],
            (string) $payload['data']['customer_id'],
        );
    }

    /**
     * Find or create a customer.
     */
    private function findOrCreateCustomer(int|string $billableId, string $billableType, string $customerId): Billable
    {
        return Customer::firstOrCreate([
            'billable_id' => $billableId,
            'billable_type' => $billableType,
        ], [
            'polar_id' => $customerId,
        ])->billable;
    }

    private function findSubscription(string $subscriptionId): ?Subscription
    {
        return Subscription::firstWhere('polar_id', $subscriptionId);
    }

    private function findOrder(string $orderId): ?Order
    {
        return Order::firstWhere('polar_id', $orderId);
    }
}
