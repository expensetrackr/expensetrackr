<?php

declare(strict_types=1);

namespace App\Services\Polar;

use App\Services\PolarService;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use InvalidArgumentException;

final class Checkout implements Responsable
{
    /**
     * @var null|array<string, string|int|bool>
     */
    private ?array $metadata = null;

    /**
     * @var null|array<string, string|int|bool>
     */
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

    /**
     * @var null|array<string, string|int|bool>
     */
    private ?array $customerMetadata = null;

    private ?string $subscriptionId = null;

    private ?string $successUrl = null;

    private ?string $embedOrigin = null;

    private ?string $productId = null;

    private ?string $productPriceId = null;

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
     * ID of the product to checkout. First available price will be selected.
     */
    public function withProductId(string $productId): self
    {
        $this->productId = $productId;

        return $this;
    }

    /**
     * ID of the product price to checkout.
     */
    public function withProductPriceId(string $productPriceId): self
    {
        $this->productPriceId = $productPriceId;

        return $this;
    }

    /**
     * URL where the customer can access the checkout session.
     */
    public function url(): string
    {
        if ($this->productPriceId && $this->productId) {
            throw new InvalidArgumentException('Cannot specify both product_id and product_price_id');
        }

        if (($this->productPriceId === null || $this->productPriceId === '' || $this->productPriceId === '0') && ($this->productId === null || $this->productId === '' || $this->productId === '0')) {
            throw new InvalidArgumentException('Must specify either product_id or product_price_id');
        }

        $data = array_filter([
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
        ], fn ($value): bool => $value !== null);

        if ($this->productId !== null && $this->productId !== '' && $this->productId !== '0') {
            $data['product_id'] = $this->productId;
        } else {
            $data['product_price_id'] = $this->productPriceId;
        }

        /**
         * @var object{
         *   created_at: string,
         *   modified_at: string|null,
         *   id: string,
         *   payment_processor: "stripe",
         *   status: "open"|"expired"|"confirmed"|"succeeded"|"failed",
         *   client_secret: string,
         *   url: string,
         *   expires_at: string,
         *   success_url: string,
         *   embed_origin: string|null,
         *   amount: int|null,
         *   tax_amount: int|null,
         *   currency: string|null,
         *   subtotal_amount: int|null,
         *   total_amount: int|null,
         *   product_id: string,
         *   product_price_id: string,
         *   discount_id: string|null,
         *   allow_discount_codes: bool,
         *   is_discount_applicable: bool,
         *   is_free_product_price: bool,
         *   is_payment_required: bool,
         *   is_payment_setup_required: bool,
         *   is_payment_form_required: bool,
         *   customer_id: string|null,
         *   customer_name: string|null,
         *   customer_email: string|null,
         *   customer_ip_address: string|null,
         *   customer_billing_address: object{
         *     line1: string|null,
         *     line2: string|null,
         *     postal_code: string|null,
         *     city: string|null,
         *     state: string|null,
         *     country: string
         *   }|null,
         *   customer_tax_id: string|null,
         *   payment_processor_metadata: array<string, string>,
         *   metadata: array<string, string|int|bool>,
         *   product: array{
         *     created_at: string,
         *     modified_at: string|null,
         *     id: string,
         *     name: string,
         *     description: string|null,
         *     is_recurring: bool,
         *     is_archived: bool,
         *     organization_id: string,
         *     prices: array<int, object{
         *       created_at: string,
         *       modified_at: string|null,
         *       id: string,
         *       amount_type: "fixed"|"custom"|"free",
         *       is_archived: bool,
         *       product_id: string,
         *       price_currency?: string,
         *       price_amount?: int,
         *       type: "recurring"|"one_time",
         *       recurring_interval?: "month"|"year",
         *       minimum_amount?: int|null,
         *       maximum_amount?: int|null,
         *       preset_amount?: int|null
         *     }>,
         *     benefits: array<int, object{
         *       created_at: string,
         *       modified_at: string|null,
         *       id: string,
         *       type: "custom"|"ads"|"discord"|"github_repository"|"downloadables"|"license_keys",
         *       description: string,
         *       selectable: bool,
         *       deletable: bool,
         *       organization_id: string
         *     }>,
         *     medias: array<int, object{
         *       id: string,
         *       organization_id: string,
         *       name: string,
         *       path: string,
         *       mime_type: string,
         *       size: int,
         *       storage_version: string|null,
         *       checksum_etag: string|null,
         *       checksum_sha256_base64: string|null,
         *       checksum_sha256_hex: string|null,
         *       last_modified_at: string|null,
         *       version: string|null,
         *       service: "product_media",
         *       is_uploaded: bool,
         *       created_at: string,
         *       size_readable: string,
         *       public_url: string
         *     }>
         *   },
         *   product_price: object{
         *     created_at: string,
         *     modified_at: string|null,
         *     id: string,
         *     amount_type: "fixed"|"custom"|"free",
         *     is_archived: bool,
         *     product_id: string,
         *     price_currency?: string,
         *     price_amount?: int,
         *     type: "recurring"|"one_time",
         *     recurring_interval?: "month"|"year",
         *     minimum_amount?: int|null,
         *     maximum_amount?: int|null,
         *     preset_amount?: int|null
         *   },
         *   discount: object{
         *     duration: "once"|"forever"|"repeating",
         *     duration_in_months?: int,
         *     type: "fixed"|"percentage",
         *     amount?: int,
         *     currency?: string,
         *     basis_points?: int,
         *     id: string,
         *     name: string,
         *     code: string|null
         *   }|null,
         *   subscription_id: string|null,
         *   attached_custom_fields: array<int, object{
         *     custom_field_id: string,
         *     custom_field: object{
         *       created_at: string,
         *       modified_at: string|null,
         *       id: string,
         *       metadata: array<string, string|int|bool>,
         *       type: "text"|"number"|"date"|"checkbox"|"select",
         *       slug: string,
         *       name: string,
         *       organization_id: string,
         *       properties: object{
         *         form_label?: string,
         *         form_help_text?: string,
         *         form_placeholder?: string,
         *         textarea?: bool,
         *         min_length?: int,
         *         max_length?: int,
         *         ge?: int,
         *         le?: int,
         *         options?: array<int, object{
         *           value: string,
         *           label: string
         *         }>
         *       }
         *     },
         *     order: int,
         *     required: bool
         *   }>,
         *   customer_metadata: array<string, string|int|bool>
         * }|null
         */
        $response = PolarService::api('POST', 'checkouts/custom', $data);

        return $response->url;
    }

    public function redirect(): RedirectResponse
    {
        return Redirect::to($this->url(), 303);
    }

    public function toResponse($request): RedirectResponse
    {
        return $this->redirect();
    }
}
