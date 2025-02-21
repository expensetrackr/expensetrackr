<?php

declare(strict_types=1);

namespace App\Concerns\Polar;

use App\Models\Polar\Subscription;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait ManagesSubscription
{
    /**
     * Get all of the subscriptions for the billable.
     *
     * @return MorphMany<Subscription, covariant $this>
     */
    public function subscriptions(): MorphMany
    {
        return $this->morphMany(Subscription::class, 'billable')->orderByDesc('created_at');
    }

    /**
     * Get a subscription instance by type.
     */
    public function subscription(string $type = 'default'): ?Subscription
    {
        return $this->subscriptions->where('type', $type)->first();
    }

    /**
     * Determine if the billable has a valid subscription.
     */
    public function subscribed(string $type = 'default', ?string $priceId = null): bool
    {
        $subscription = $this->subscription($type);

        if (! $subscription || ! $subscription->valid()) {
            return false;
        }

        return $priceId !== null && $priceId !== '' && $priceId !== '0' ? $subscription->hasPrice($priceId) : true;
    }

    /**
     * Determine if the billable has a valid subscription for the given variant.
     */
    public function subscribedToPrice(string $priceId, string $type = 'default'): bool
    {
        $subscription = $this->subscription($type);

        if (! $subscription || ! $subscription->valid()) {
            return false;
        }

        return $subscription->hasPrice($priceId);
    }
}
