<?php

declare(strict_types=1);

namespace App\Concerns\Polar;

use App\Enums\Polar\OrderStatus;
use App\Models\Polar\Order;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait ManagesOrders
{
    /**
     * Get all of the orders for the billable.
     *
     * @return MorphMany<Order, covariant $this>
     */
    public function orders(): MorphMany
    {
        return $this->morphMany(Order::class, 'billable')->orderByDesc('created_at');
    }

    /**
     * Determine if the billable has purchased a specific product.
     */
    public function hasPurchasedProduct(string $productId): bool
    {
        return $this->orders()->where('product_id', $productId)->where('status', OrderStatus::PAID)->exists();
    }

    /**
     * Determine if the billable has purchased a specific price of a product.
     */
    public function hasPurchasedPrice(string $productPriceId): bool
    {
        return $this->orders()->where('product_price_id', $productPriceId)->where('status', OrderStatus::PAID)->exists();
    }
}
