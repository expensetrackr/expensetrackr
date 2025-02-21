<?php

declare(strict_types=1);

namespace App\Models\Polar;

use App\Enums\Polar\OrderStatus;
use Carbon\CarbonImmutable;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use InvalidArgumentException;
use Polar\Models\Components;

/**
 * @property int $id
 * @property string $billable_type
 * @property int $billable_id
 * @property string|null $polar_id
 * @property string $status
 * @property int $amount
 * @property int $tax_amount
 * @property int $refunded_amount
 * @property int $refunded_tax_amount
 * @property string $currency
 * @property string $billing_reason
 * @property string $customer_id
 * @property string $product_id
 * @property string $product_price_id
 * @property CarbonImmutable|null $refunded_at
 * @property CarbonImmutable $ordered_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Model $billable
 *
 * @method static Builder<static>|Order newModelQuery()
 * @method static Builder<static>|Order newQuery()
 * @method static Builder<static>|Order query()
 * @method static Builder<static>|Order whereAmount($value)
 * @method static Builder<static>|Order whereBillableId($value)
 * @method static Builder<static>|Order whereBillableType($value)
 * @method static Builder<static>|Order whereBillingReason($value)
 * @method static Builder<static>|Order whereCreatedAt($value)
 * @method static Builder<static>|Order whereCurrency($value)
 * @method static Builder<static>|Order whereCustomerId($value)
 * @method static Builder<static>|Order whereId($value)
 * @method static Builder<static>|Order whereOrderedAt($value)
 * @method static Builder<static>|Order wherePolarId($value)
 * @method static Builder<static>|Order whereProductId($value)
 * @method static Builder<static>|Order whereProductPriceId($value)
 * @method static Builder<static>|Order whereRefundedAmount($value)
 * @method static Builder<static>|Order whereRefundedAt($value)
 * @method static Builder<static>|Order whereRefundedTaxAmount($value)
 * @method static Builder<static>|Order whereStatus($value)
 * @method static Builder<static>|Order whereTaxAmount($value)
 * @method static Builder<static>|Order whereUpdatedAt($value)
 * @method static Builder<static>|Order paid()
 * @method static Builder<static>|Order partiallyRefunded()
 * @method static Builder<static>|Order refunded()
 *
 * @mixin Eloquent
 */
final class Order extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'polar_orders';

    /**
     * Get the billable model related to the customer.
     *
     * @return MorphTo<Model, covariant $this>
     */
    public function billable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Check if the order is paid.
     */
    public function paid(): bool
    {
        return $this->status === OrderStatus::PAID->value;
    }

    /**
     * Filter query by paid.
     *
     * @param  Builder<Order>  $query
     */
    public function scopePaid(Builder $query): void
    {
        $query->where('status', OrderStatus::PAID);
    }

    /**
     * Check if the order is refunded.
     */
    public function refunded(): bool
    {
        return $this->status === OrderStatus::REFUNDED->value;
    }

    /**
     * Filter query by refunded.
     *
     * @param  Builder<Order>  $query
     */
    public function scopeRefunded(Builder $query): void
    {
        $query->where('status', OrderStatus::REFUNDED);
    }

    /**
     * Check if the order is partially refunded.
     */
    public function partiallyRefunded(): bool
    {
        return $this->status === OrderStatus::PARTIALLY_REFUNDED->value;
    }

    /**
     * Filter query by partially refunded.
     *
     * @param  Builder<Order>  $query
     */
    public function scopePartiallyRefunded(Builder $query): void
    {
        $query->where('status', OrderStatus::PARTIALLY_REFUNDED);
    }

    /**
     * Determine if the order is for a specific product.
     */
    public function hasProduct(string $productId): bool
    {
        return $this->product_id === $productId;
    }

    /**
     * Determine if the order is for a specific variant.
     */
    public function hasVariant(string $productPriceId): bool
    {
        return $this->product_price_id === $productPriceId;
    }

    /**
     * Sync the order with the given attributes.
     */
    public function sync(?Components\Order $order): self
    {
        if (! $order instanceof Components\Order) {
            throw new InvalidArgumentException('The order must be an instance of Polar\Models\Components\Order');
        }

        $this->update([
            'polar_id' => $order->id,
            'status' => $order->status,
            'amount' => $order->amount,
            'tax_amount' => $order->taxAmount,
            'refunded_amount' => $order->refundedAmount,
            'refunded_tax_amount' => $order->refundedTaxAmount,
            'currency' => $order->currency,
            'billing_reason' => $order->billingReason,
            'customer_id' => $order->customerId,
            'product_id' => $order->productId,
            'product_price_id' => $order->productPriceId,
            'ordered_at' => $order->createdAt,
        ]);

        return $this;
    }

    /**
     * The attributes that should be cast to native types.
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'ordered_at' => 'datetime',
            'refunded_at' => 'datetime',
        ];
    }
}
