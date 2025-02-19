<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Services\Polar\Checkout;
use Illuminate\Database\Eloquent\Model;

/** @mixin Model */
trait ManagesCheckouts
{
    /**
     * Create a new checkout instance to sell a product with a custom price.
     *
     * @param  array<string, string|int>  $options
     * @param  array<string, string|int|bool>  $metadata
     */
    public function charge(int $amount, string $variant, array $options = [], array $metadata = []): Checkout
    {
        return $this->checkout($variant, array_merge($options, [
            'amount' => $amount,
        ]), $metadata);
    }

    /**
     * Create a new checkout instance to sell a product.
     *
     * @param  array<string, string|int>  $options
     * @param  array<string, string|int|bool>  $metadata
     */
    public function checkout(string $variant, array $options = [], array $metadata = []): Checkout
    {
        /** @var string|int $key */
        $key = $this->getKey();

        $metadata = array_merge($metadata, [
            'billable_id' => (string) $key,
            'billable_type' => $this->getMorphClass(),
        ]);

        $billingAddress = null;
        if (isset($options['country'])) {
            $billingAddress = array_filter([
                'country' => (string) $options['country'],
                'postal_code' => isset($options['zip']) ? (string) $options['zip'] : null,
                'line1' => isset($options['line1']) ? (string) $options['line1'] : null,
                'line2' => isset($options['line2']) ? (string) $options['line2'] : null,
                'city' => isset($options['city']) ? (string) $options['city'] : null,
                'state' => isset($options['state']) ? (string) $options['state'] : null,
            ], fn ($value): bool => $value !== null);
        }

        $checkout = Checkout::make()
            ->withCustomerName((string) ($options['customer_name'] ?? $this->polarName() ?? ''))
            ->withCustomerEmail((string) ($options['customer_email'] ?? $this->polarEmail() ?? ''))
            ->withCustomerBillingAddress($billingAddress)
            ->withMetadata($metadata);

        if (isset($options['tax_id'])) {
            $checkout->withCustomerTaxId((string) $options['tax_id']);
        }

        if (isset($options['discount_id'])) {
            $checkout->withDiscountId((string) $options['discount_id']);
        }

        if (isset($options['amount']) && is_numeric($options['amount'])) {
            $checkout->withAmount((int) $options['amount']);
        }

        return $checkout;
    }
}
