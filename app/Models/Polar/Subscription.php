<?php

declare(strict_types=1);

namespace App\Models\Polar;

use App\Exceptions\PolarApiError;
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
 * @property-read Model $billable
 *
 * @method static Builder<static>|Subscription active()
 * @method static Builder<static>|Subscription cancelled()
 * @method static Builder<static>|Subscription incomplete()
 * @method static Builder<static>|Subscription incompleteExpired()
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
     * Determine if the subscription is active, on trial, past due, or within its grace period.
     */
    public function valid(): bool
    {
        return $this->active() || $this->onTrial() || $this->pastDue() || $this->onGracePeriod(); // @phpstan-ignore-line
    }

    /**
     * Determine if the subscription is incomplete.
     */
    public function incomplete(): bool
    {
        return $this->status === Components\SubscriptionStatus::Incomplete->value;
    }

    /**
     * Filter query by incomplete.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeIncomplete(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::Incomplete);
    }

    /**
     * Determine if the subscription is incomplete expired.
     */
    public function incompleteExpired(): bool
    {
        return $this->status === Components\SubscriptionStatus::IncompleteExpired->value;
    }

    /**
     * Filter query by incomplete expired.
     *
     * @param  Builder<Subscription>  $query
     */
    public function scopeIncompleteExpired(Builder $query): void
    {
        $query->where('status', Components\SubscriptionStatus::IncompleteExpired);
    }

    /**
     * Determine if the subscription is trialing.
     */
    public function trialing(): bool
    {
        return $this->status === Components\SubscriptionStatus::Trialing->value;
    }

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

        $this->sync((array) $response);

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
    public function cancel(): self
    {
        $service = app(PolarService::class);
        $response = $service->updateSubscription(
            subscriptionId: $this->polar_id,
            request: new Components\SubscriptionCancel(cancelAtPeriodEnd: true),
        );

        $this->sync((array) $response);

        return $this;
    }

    /**
     * Resume the subscription.
     */
    public function resume(): self
    {
        if ($this->incompleteExpired()) {
            throw new PolarApiError('Subscription is incomplete and expired.');
        }

        $service = app(PolarService::class);
        $response = $service->updateSubscription(
            subscriptionId: $this->polar_id,
            request: new Components\SubscriptionCancel(cancelAtPeriodEnd: false),
        );

        $this->sync((array) $response);

        return $this;
    }

    /**
     * Sync the subscription with the given attributes.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function sync(array $attributes): self
    {
        $this->update([
            'status' => $attributes['status'],
            'product_id' => $attributes['product_id'],
            'price_id' => $attributes['price_id'],
            'current_period_end' => isset($attributes['current_period_end']) ? Carbon::make($attributes['current_period_end']) : null,
            'ends_at' => isset($attributes['ends_at']) ? Carbon::make($attributes['ends_at']) : null,
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
