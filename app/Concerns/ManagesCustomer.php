<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\InvalidCustomer;
use App\Exceptions\PolarApiError;
use App\Models\Customer;
use App\Services\PolarService;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Http\RedirectResponse;

trait ManagesCustomer
{
    /**
     * Create a customer record for the billable model.
     */
    public function createAsCustomer(array $attributes = []): Customer
    {
        return $this->customer()->create($attributes);
    }

    /**
     * Get the customer related to the billable model.
     *
     * @return MorphOne<Customer, covariant $this>
     */
    public function customer(): MorphOne
    {
        return $this->morphOne(Customer::class, 'billable');
    }

    /**
     * Get the billable's name to associate with Polar.
     */
    public function polarName(): ?string
    {
        return $this->name ?? null;
    }

    /**
     * Get the billable's email address to associate with Polar.
     */
    public function polarEmail(): ?string
    {
        return $this->email ?? null;
    }

    /**
     * Get the billable's country to associate with Polar.
     *
     * This needs to be a 2 letter code.
     */
    public function polarCountry(): ?string
    {
        return $this->country ?? null; // 'US'
    }

    /**
     * Get the billable's zip code to associate with Polar.
     */
    public function polarZip(): ?string
    {
        return $this->zip ?? null; // '10038'
    }

    /**
     * Get the billable's tax number to associate with Polar.
     */
    public function polarTaxId(): ?string
    {
        return $this->tax_id ?? null; // 'GB123456789'
    }

    /**
     * Generate a redirect response to the billable's customer portal.
     */
    public function redirectToCustomerPortal(): RedirectResponse
    {
        return new RedirectResponse($this->customerPortalUrl());
    }

    /**
     * Get the customer portal url for this billable.
     *
     * @throws PolarApiError
     * @throws InvalidCustomer
     */
    public function customerPortalUrl(): string
    {
        $this->assertCustomerExists();

        /**
         * @var object{
         *   created_at: string,
         *   modified_at: string|null,
         *   id: string,
         *   token: string,
         *   expires_at: string,
         *   customer_portal_url: string,
         *   customer_id: string,
         *   customer: object{
         *     created_at: string,
         *     modified_at: string|null,
         *     id: string,
         *     metadata: array<string, string|int|bool>,
         *     email: string,
         *     email_verified: bool,
         *     name: string|null,
         *     billing_address: object{
         *       line1: string|null,
         *       line2: string|null,
         *       postal_code: string|null,
         *       city: string|null,
         *       state: string|null,
         *       country: string
         *     }|null,
         *     tax_id: array{string, string}|null,
         *     organization_id: string,
         *     avatar_url: string
         *   }
         * } $response
         */
        $response = PolarService::api('GET', 'customers/customer-sessions', [
            'customer_id' => $this->customer->polar_id,
        ]);

        return $response->customer_portal_url;
    }

    /**
     * Determine if the billable is already a Polar customer and throw an exception if not.
     *
     * @throws InvalidCustomer
     */
    protected function assertCustomerExists(): void
    {
        if (is_null($this->customer) || is_null($this->customer->polar_id)) {
            throw InvalidCustomer::notYetCreated($this);
        }
    }
}
