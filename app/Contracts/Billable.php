<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Services\Polar\Checkout;

interface Billable
{
    /**
     * Create a new checkout instance to sell a product with a custom price.
     *
     * @param  array<string, string|int>  $options
     * @param  array<string, string|int|bool>  $metadata
     */
    public function charge(int $amount, string $variant, array $options = [], array $metadata = []): Checkout;

    /**
     * Create a new checkout instance to sell a product.
     *
     * @param  array<string, string|int>  $options
     * @param  array<string, string|int|bool>  $metadata
     */
    public function checkout(string $variant, array $options = [], array $metadata = []): Checkout;

    /**
     * Get the customer's name that should be synced with Polar.
     */
    public function polarName(): ?string;

    /**
     * Get the customer's email that should be synced with Polar.
     */
    public function polarEmail(): ?string;
}
