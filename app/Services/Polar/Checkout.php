<?php

declare(strict_types=1);

namespace App\Services\Polar;

use App\Data\Polar\CheckoutResponseData;
use App\Data\Polar\CreateCheckoutData;
use App\Services\PolarService;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

final class Checkout implements Responsable
{
    /** @var null|array<string, string|int|bool> */
    private ?array $metadata = null;

    /** @var null|array<string, string|int|bool> */
    private ?array $customFieldData = null;

    private ?string $discountId = null;

    private bool $allowDiscountCodes = true;

    private ?int $amount = null;

    private ?string $customerId = null;

    private ?string $customerName = null;

    private ?string $customerEmail = null;

    private ?string $customerIpAddress = null;

    /**
     * @var array{
     *     country: string,
     *     line1?: string|null,
     *     line2?: string|null,
     *     postal_code?: string|null,
     *     city?: string|null,
     *     state?: string|null
     * }|null
     */
    private ?array $customerBillingAddress = null;

    private ?string $customerTaxId = null;

    /** @var null|array<string, string|int|bool> */
    private ?array $customerMetadata = null;

    private ?string $subscriptionId = null;

    private ?string $successUrl = null;

    private ?string $embedOrigin = null;

    /** @var array<string> */
    private array $products = [];

    public static function make(): static
    {
        return new self();
    }

    /**
     * Key-value object allowing you to store additional information.
     *
     * The key must be a string with a maximum length of **40 characters**. The value must be either:
     *
     * - A string with a maximum length of **500 characters**
     * - An integer
     * - A boolean
     *
     * You can store up to **50 key-value pairs**.
     *
     * @param  array<string, string|int|bool>  $metadata
     */
    public function withMetadata(array $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    /**
     * Key-value object storing custom field values.
     *
     * @param  array<string, string|int|bool>  $customFieldData
     */
    public function withCustomFieldData(array $customFieldData): self
    {
        $this->customFieldData = $customFieldData;

        return $this;
    }

    /**
     * ID of the discount to apply to the checkout.
     */
    public function withDiscountId(string $discountId): self
    {
        $this->discountId = $discountId;

        return $this;
    }

    /**
     * Whether to allow the customer to apply discount codes. If you apply a discount through `discount_id`, it'll still be applied, but the customer won't be able to change it.
     */
    public function withoutDiscountCodes(): self
    {
        $this->allowDiscountCodes = false;

        return $this;
    }

    /**
     * The custom amount to charge the customer.
     */
    public function withAmount(int $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * ID of an existing customer in the organization. The customer data will be pre-filled in the checkout form. The resulting order will be linked to this customer.
     */
    public function withCustomerId(string $customerId): self
    {
        $this->customerId = $customerId;

        return $this;
    }

    public function withCustomerName(string $customerName): self
    {
        $this->customerName = $customerName;

        return $this;
    }

    public function withCustomerEmail(string $customerEmail): self
    {
        $this->customerEmail = $customerEmail;

        return $this;
    }

    public function withCustomerIpAddress(string $customerIpAddress): self
    {
        $this->customerIpAddress = $customerIpAddress;

        return $this;
    }

    /**
     * @param  array{
     *     country: string,
     *     line1?: string|null,
     *     line2?: string|null,
     *     postal_code?: string|null,
     *     city?: string|null,
     *     state?: string|null
     * }|null  $customerBillingAddress
     */
    public function withCustomerBillingAddress(?array $customerBillingAddress): self
    {
        $this->customerBillingAddress = $customerBillingAddress;

        return $this;
    }

    public function withCustomerTaxId(string $customerTaxId): self
    {
        $this->customerTaxId = $customerTaxId;

        return $this;
    }

    /**
     * Key-value object allowing you to store additional information that'll be copied to the created customer.
     *
     * The key must be a string with a maximum length of **40 characters**. The value must be either:
     *
     * - A string with a maximum length of **500 characters**
     * - An integer
     * - A boolean
     *
     * You can store up to **50 key-value pairs**.
     *
     * @param  array<string, string|int|bool>  $customerMetadata
     */
    public function withCustomerMetadata(array $customerMetadata): self
    {
        $this->customerMetadata = $customerMetadata;

        return $this;
    }

    /**
     * ID of a subscription to upgrade. It must be on a free pricing. If checkout is successful, metadata set on this checkout will be copied to the subscription, and existing keys will be overwritten.
     */
    public function withSubscriptionId(string $subscriptionId): self
    {
        $this->subscriptionId = $subscriptionId;

        return $this;
    }

    /**
     * URL where the customer will be redirected after a successful payment.You can add the `checkout_id={CHECKOUT_ID}` query parameter to retrieve the checkout session id.
     */
    public function withSuccessUrl(string $successUrl): self
    {
        $this->successUrl = $successUrl;

        return $this;
    }

    /**
     * If you plan to embed the checkout session, set this to the Origin of the embedding page. It'll allow the Polar iframe to communicate with the parent page.
     */
    public function withEmbedOrigin(string $embedOrigin): self
    {
        $this->embedOrigin = $embedOrigin;

        return $this;
    }

    /**
     * List of product IDs available to select at that checkout. The first one will be selected by default.
     *
     * @param  array<string>  $products
     */
    public function withProducts(array $products): self
    {
        $this->products = $products;

        return $this;
    }

    public function toResponse($request): RedirectResponse
    {
        return $this->redirect();
    }

    public function redirect(): RedirectResponse
    {
        return Redirect::to($this->url(), 303);
    }

    /**
     * URL where the customer can access the checkout session.
     */
    public function url(): string
    {
        $data = CreateCheckoutData::from([
            'metadata' => $this->metadata,
            'custom_field_data' => $this->customFieldData,
            'discount_id' => $this->discountId,
            'allow_discount_codes' => $this->allowDiscountCodes,
            'amount' => $this->amount,
            'customer_id' => $this->customerId,
            'customer_name' => $this->customerName,
            'customer_email' => $this->customerEmail,
            'customer_ip_address' => $this->customerIpAddress,
            'customer_billing_address' => $this->customerBillingAddress,
            'customer_tax_id' => $this->customerTaxId,
            'customer_metadata' => $this->customerMetadata,
            'subscription_id' => $this->subscriptionId,
            'success_url' => $this->successUrl,
            'embed_origin' => $this->embedOrigin,
            'products' => $this->products,
        ]);

        $response = PolarService::api('POST', 'checkouts', $data->toFilteredArray());
        $checkout = CheckoutResponseData::from($response);

        return $checkout->url;
    }
}
