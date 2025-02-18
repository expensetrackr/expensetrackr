<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Services\Polar\Checkout;

trait ManagesCheckouts
{
    /**
     * Create a new checkout instance to sell a product with a custom price.
     */
    public function charge(int $amount, string $variant, array $options = [], array $metadata = [])
    {
        return $this->checkout($variant, array_merge($options, [
            'amount' => $amount,
        ]), $metadata);
    }

    /**
     * Create a new checkout instance to sell a product.
     */
    public function checkout(string $variant, array $options = [], array $metadata = []): Checkout
    {
        $metadata = array_merge($metadata, [
            'billable_id' => (string) $this->getKey(),
            'billable_type' => $this->getMorphClass(),
        ]);

        $billingAddress = null;
        if (isset($options['country']) || $this->polarCountry()) {
            $billingAddress = array_filter([
                'country' => $options['country'] ?? $this->polarCountry() ?? '',
                'postal_code' => $options['zip'] ?? $this->polarZip() ?? null,
                'line1' => $options['line1'] ?? null,
                'line2' => $options['line2'] ?? null,
                'city' => $options['city'] ?? null,
                'state' => $options['state'] ?? null,
            ], fn ($value): bool => $value !== null);
        }

        return Checkout::make()
            ->withCustomerName($options['customer_name'] ?? (string) $this->polarName())
            ->withCustomerEmail($options['customer_email'] ?? (string) $this->polarEmail())
            ->withCustomerBillingAddress($billingAddress)
            ->withCustomerTaxId($options['tax_id'] ?? (string) $this->polarTaxId())
            ->withDiscountId($options['discount_id'] ?? '')
            ->withAmount($options['amount'] ?? null)
            ->withMetadata($metadata);
    }
}
