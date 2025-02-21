<?php

declare(strict_types=1);

namespace App\Models\Polar;

use App\Services\PolarService;
use Carbon\CarbonImmutable;
use Database\Factories\SubscriptionFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Polar\Models\Components;

/**
 * @property int $id
 * @property string $billable_type
 * @property int $billable_id
 * @property string $type
 * @property string $polar_id
 * @property string $status
 * @property string $product_id
 * @property string $price_id
 * @property CarbonImmutable|null $current_period_end
 * @property CarbonImmutable|null $ends_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Subscription $billable
 *
 * @method static Builder<static>|Subscription active()
 * @method static Builder<static>|Subscription cancelled()
 * @method static Builder<static>|Subscription newModelQuery()
 * @method static Builder<static>|Subscription newQuery()
 * @method static Builder<static>|Subscription onTrial()
 * @method static Builder<static>|Subscription pastDue()
 * @method static Builder<static>|Subscription query()
 * @method static Builder<static>|Subscription unpaid()
 * @method static Builder<static>|Subscription whereBillableId($value)
 * @method static Builder<static>|Subscription whereBillableType($value)
 * @method static Builder<static>|Subscription whereCreatedAt($value)
 * @method static Builder<static>|Subscription whereCurrentPeriodEnd($value)
 * @method static Builder<static>|Subscription whereEndsAt($value)
 * @method static Builder<static>|Subscription whereId($value)
 * @method static Builder<static>|Subscription wherePolarId($value)
 * @method static Builder<static>|Subscription wherePriceId($value)
 * @method static Builder<static>|Subscription whereProductId($value)
 * @method static Builder<static>|Subscription whereStatus($value)
 * @method static Builder<static>|Subscription whereType($value)
 * @method static Builder<static>|Subscription whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class Subscription extends Model
{
    /** @use HasFactory<SubscriptionFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'polar_subscriptions';

    /**
     * Get the billable model related to the subscription.
     *
     * @return MorphTo<Model, covariant $this>
     */
    public function billable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Determine if the subscription is active, on trial, past due, paused for free, or within its grace period.
     */
    public function valid(): bool
    {
        return $this->active() || $this->onTrial() || $this->pastDue() || $this->onGracePeriod(); // @phpstan-ignore-line
    }

    /**
     * Check if the subscription is on trial.
     */
    public function onTrial(): bool
    {
        return $this->status === Components\SubscriptionStatus::Trialing->value;
    }

    /**
     * Filter query by on trial.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeOnTrial(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::Trialing);
    }

    /**
     * Check if the subscription is active.
     */
    public function active(): bool
    {
        return $this->status === Components\SubscriptionStatus::Active->value;
    }

    /**
     * Filter query by active.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::Active);
    }

    /**
     * Check if the subscription is past due.
     */
    public function pastDue(): bool
    {
        return $this->status === Components\SubscriptionStatus::PastDue->value;
    }

    /**
     * Filter query by past due.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopePastDue(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::PastDue);
    }

    /**
     * Check if the subscription is unpaid.
     */
    public function unpaid(): bool
    {
        return $this->status === Components\SubscriptionStatus::Unpaid->value;
    }

    /**
     * Filter query by unpaid.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeUnpaid(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::Unpaid);
    }

    /**
     * Check if the subscription is cancelled.
     */
    public function cancelled(): bool
    {
        return $this->status === Components\SubscriptionStatus::Canceled->value;
    }

    /**
     * Filter query by cancelled.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeCancelled(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::Canceled);
    }

    /**
     * Determine if the subscription is within its grace period after cancellation.
     */
    public function onGracePeriod(): bool
    {
        return $this->cancelled() && $this->ends_at?->isFuture(); // @phpstan-ignore-line
    }

    /**
     * Determine if the subscription is on a specific product.
     */
    public function hasProduct(string $productId): bool
    {
        return $this->product_id === $productId;
    }

    /**
     * Determine if the subscription is on a specific price.
     */
    public function hasPrice(string $priceId): bool
    {
        return $this->price_id === $priceId;
    }

    /**
     * Swap the subscription to a new product.
     */
    public function swap(string $productId, ?Components\SubscriptionProrationBehavior $prorationBehavior): self
    {
        $service = app(PolarService::class);

        $response = $service->updateSubscription(
            subscriptionId: $this->polar_id,
            request: new Components\SubscriptionUpdateProduct(
                productId: $productId,
                prorationBehavior: $prorationBehavior,
            ),
        );

        $this->sync($response);

        return $this;
    }

    /**
     * Swap the subscription to a new product plan and invoice immediately.
     */
    public function swapAndInvoice(string $productId): self
    {
        return $this->swap($productId, Components\SubscriptionProrationBehavior::Invoice);
    }

    /**
     * Cancel the subscription.
     */
    public function cancel(): void
    {
        $service = app(PolarService::class);

        $service->updateSubscription(
            subscriptionId: $this->polar_id,
            request: new Components\SubscriptionCancel(cancelAtPeriodEnd: true),
        );
    }

    /**
     * Sync the subscription with the given attributes.
     */
    public function sync(?Components\Subscription $subscription): self
    {
        if (! $subscription instanceof Components\Subscription) {
            return $this;
        }

        $this->update([
            'status' => $subscription->status,
            'product_id' => $subscription->productId,
            'price_id' => $subscription->priceId,
            'current_period_end' => isset($subscription->currentPeriodEnd) ? Carbon::make($subscription->currentPeriodEnd) : null,
            'ends_at' => isset($subscription->endsAt) ? Carbon::make($subscription->endsAt) : null,
        ]);

        return $this;
    }

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'status' => Components\SubscriptionStatus::class,
            'current_period_end' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
