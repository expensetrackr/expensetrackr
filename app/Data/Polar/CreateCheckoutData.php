<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

final class CreateCheckoutData extends Data
{
    public function __construct(
        /**
         * Key-value object allowing you to store additional information.
         *
         * The key must be a string with a maximum length of **40 characters**.
         * The value must be either:
         *
         * A string with a maximum length of **500 characters**
         * An integer
         * A boolean
         *
         * You can store up to **50 key-value pairs**.
         *
         * @var array<string, string|int|bool>
         */
        #[Min(1)]
        #[Max(500)]
        public readonly ?array $metadata = null,
        /**
         * Key-value object storing custom field values.
         *
         * @var array<string, string|int|bool|null>
         */
        #[MapInputName('custom_field_data')]
        public readonly ?array $customFieldData = null,
        /**
         * ID of the discount to apply to the checkout.
         */
        #[MapInputName('discount_id')]
        public readonly ?string $discountId = null,
        /**
         * Whether to allow the customer to apply discount codes. If you apply a discount through `discount_id`, it'll still be applied, but the customer won't be able to change it.
         */
        #[MapInputName('allow_discount_codes')]
        public readonly bool $allowDiscountCodes = true,
        /**
         * Amount to pay in cents. Only useful for custom prices, it'll be ignored for fixed and free prices.
         */
        #[Min(50)]
        #[Max(99999999)]
        public readonly ?int $amount = null,
        /**
         * ID of an existing customer in the organization. The customer data will be pre-filled in the checkout form. The resulting order will be linked to this customer.
         */
        #[MapInputName('customer_id')]
        public readonly ?string $customerId = null,
        /**
         * Name of the customer.
         */
        #[MapInputName('customer_name')]
        public readonly ?string $customerName = null,
        /**
         * Email address of the customer.
         */
        #[MapInputName('customer_email')]
        public readonly ?string $customerEmail = null,
        #[MapInputName('customer_ip_address')]
        public readonly ?string $customerIpAddress = null,
        /**
         * Billing address of the customer.
         */
        #[MapInputName('customer_billing_address')]
        public readonly ?CustomerBillingAddressData $customerBillingAddress = null,
        #[MapInputName('customer_tax_id')]
        public readonly ?string $customerTaxId = null,
        /**
         * Key-value object allowing you to store additional information that'll be copied to the created customer.

         * The key must be a string with a maximum length of **40 characters**.
         * The value must be either:
         *
         * A string with a maximum length of **500 characters**
         * An integer
         * A boolean
         *
         * You can store up to **50 key-value pairs**.
         *
         * @var array<string, string|int|bool>
         */
        #[MapInputName('customer_metadata')]
        #[ArrayType(type: 'string|integer|boolean')]
        public readonly ?array $customerMetadata = null,
        /**
         * ID of a subscription to upgrade. It must be on a free pricing. If checkout is successful, metadata set on this checkout will be copied to the subscription, and existing keys will be overwritten.
         */
        #[MapInputName('subscription_id')]
        public readonly ?string $subscriptionId = null,
        /**
         * URL where the customer will be redirected after a successful payment.You can add the `checkout_id={CHECKOUT_ID}` query parameter to retrieve the checkout session id.
         */
        #[MapInputName('success_url')]
        #[Min(1)]
        #[Max(2083)]
        public readonly ?string $successUrl = null,
        /**
         * If you plan to embed the checkout session, set this to the Origin of the embedding page. It'll allow the Polar iframe to communicate with the parent page.
         */
        #[MapInputName('embed_origin')]
        public readonly ?string $embedOrigin = null,
        /**
         * List of product IDs available to select at that checkout. The first one will be selected by default.
         *
         * @var array<string>
         */
        public readonly ?array $products = null,
    ) {}

    /**
     * Convert the data object to an array and remove null values.
     *
     * @return array<string, mixed>
     */
    public function toFilteredArray(): array
    {
        /** @var array<string, mixed> */
        return array_filter(
            $this->toArray(),
            fn ($value): bool => $value !== null
        );
    }
}
