<?php

declare(strict_types=1);

namespace App\Data\Polar;

use App\Enums\Polar\CheckoutStatus;
use App\Enums\Polar\PaymentProcessor;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\IP;
use Spatie\LaravelData\Attributes\Validation\Url;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\EnumCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class CheckoutResponseData extends Data
{
    public function __construct(
        /**
         * Creation timestamp of the object.
         */
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        /**
         * Last modification timestamp of the object.
         */
        #[MapInputName('modified_at')]
        public readonly ?string $modifiedAt,
        /**
         * The ID of the object.
         */
        public readonly string $id,
        /**
         * Payment processor used.
         *
         * Available options: `stripe`
         */
        #[MapInputName('payment_processor')]
        #[WithCast(EnumCast::class, type: PaymentProcessor::class)]
        public readonly PaymentProcessor $paymentProcessor,
        /**
         * Status of the checkout session.
         *
         * Available options: `open`, `expired`, `confirmed`, `succeeded`, `failed`
         */
        #[WithCast(EnumCast::class, type: CheckoutStatus::class)]
        public readonly CheckoutStatus $status,
        /**
         * Client secret used to update and complete the checkout session from the client.
         */
        #[MapInputName('client_secret')]
        public readonly string $clientSecret,
        /**
         * URL where the customer can access the checkout session.
         */
        #[Url]
        public readonly string $url,
        /**
         * Expiration date and time of the checkout session.
         */
        #[MapInputName('expires_at')]
        public readonly string $expiresAt,
        /**
         * URL where the customer will be redirected after a successful payment.
         */
        #[MapInputName('success_url')]
        #[Url]
        public readonly string $successUrl,
        /**
         * When checkout is embedded, represents the Origin of the page embedding the checkout. Used as a security measure to send messages only to the embedding page.
         */
        #[MapInputName('embed_origin')]
        public readonly ?string $embedOrigin,
        /**
         * Amount to pay in cents. Only useful for custom prices, it'll be ignored for fixed and free prices.
         */
        public readonly ?int $amount,
        /**
         * Computed tax amount to pay in cents.
         */
        #[MapInputName('tax_amount')]
        public readonly ?int $taxAmount,
        /**
         * Currency code of the checkout session.
         */
        public readonly ?string $currency,
        /**
         * Subtotal amount in cents, including discounts and before tax.
         */
        #[MapInputName('subtotal_amount')]
        public readonly ?int $subtotalAmount,
        /**
         * Total amount to pay in cents, including discounts and after tax.
         */
        #[MapInputName('total_amount')]
        public readonly ?int $totalAmount,
        /**
         * ID of the product to checkout.
         */
        #[MapInputName('product_id')]
        public readonly string $productId,
        /**
         * ID of the product price to checkout.
         */
        #[MapInputName('product_price_id')]
        public readonly string $productPriceId,
        /**
         * ID of the discount applied to the checkout.
         */
        #[MapInputName('discount_id')]
        public readonly ?string $discountId,
        /**
         * Whether to allow the customer to apply discount codes. If you apply a discount through `discount_id`, it'll still be applied, but the customer won't be able to change it.
         */
        #[MapInputName('allow_discount_codes')]
        public readonly bool $allowDiscountCodes,
        /**
         * Whether the discount is applicable to the checkout. Typically, free and custom prices are not discountable.
         */
        #[MapInputName('is_discount_applicable')]
        public readonly bool $isDiscountApplicable,
        /**
         * Whether the product price is free, regardless of discounts.
         */
        #[MapInputName('is_free_product_price')]
        public readonly bool $isFreeProductPrice,
        /**
         * Whether the checkout requires payment, e.g. in case of free products or discounts that cover the total amount.
         */
        #[MapInputName('is_payment_required')]
        public readonly bool $isPaymentRequired,
        /**
         * Whether the checkout requires setting up a payment method, regardless of the amount, e.g. subscriptions that have first free cycles.
         */
        #[MapInputName('is_payment_setup_required')]
        public readonly bool $isPaymentSetupRequired,
        /**
         * Whether the checkout requires a payment form, whether because of a payment or payment method setup.
         */
        #[MapInputName('is_payment_form_required')]
        public readonly bool $isPaymentFormRequired,
        #[MapInputName('customer_id')]
        public readonly ?string $customerId,
        /**
         * Name of the customer.
         */
        #[MapInputName('customer_name')]
        public readonly ?string $customerName,
        /**
         * Email address of the customer.
         */
        #[MapInputName('customer_email')]
        #[Email]
        public readonly ?string $customerEmail,
        #[MapInputName('customer_ip_address')]
        #[IP]
        public readonly ?string $customerIpAddress,
        /**
         * Billing address of the customer.
         */
        #[MapInputName('customer_billing_address')]
        public readonly ?CustomerBillingAddressData $customerBillingAddress,
        #[MapInputName('customer_tax_id')]
        public readonly ?string $customerTaxId,
        /** @var array<string, string> */
        #[MapInputName('payment_processor_metadata')]
        public readonly array $paymentProcessorMetadata,
        /** @var array<string, string|int|bool> */
        public readonly array $metadata,
        /**
         * List of products available to select.
         *
         * @var DataCollection<int, ProductData>
         */
        public readonly DataCollection $products,
        /**
         * Product selected to checkout.
         */
        public readonly ProductData $product,
        /**
         * Price of the selected product.
         */
        #[MapInputName('product_price')]
        public readonly ProductPriceData $productPrice,
        /**
         * Schema for a fixed amount discount that is applied once or forever.
         */
        public readonly ?DiscountData $discount,
        #[MapInputName('subscription_id')]
        public readonly ?string $subscriptionId,
        /** @var DataCollection<int, AttachedCustomFieldsData> */
        #[MapInputName('attached_custom_fields')]
        #[DataCollectionOf(AttachedCustomFieldsData::class)]
        public readonly DataCollection $attachedCustomFields,
        /** @var array<string, string|int|bool> */
        #[MapInputName('customer_metadata')]
        public readonly array $customerMetadata,
        /** @var array<string, string|int|bool|null> */
        #[MapInputName('custom_field_data')]
        public readonly array $customFieldData,
    ) {}
}
