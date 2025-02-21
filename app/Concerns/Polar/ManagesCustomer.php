<?php

declare(strict_types=1);

namespace App\Concerns\Polar;

use App\Exceptions\InvalidCustomer;
use App\Exceptions\PolarApiError;
use App\Models\Polar\Customer;
use App\Services\PolarService;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Http\RedirectResponse;
use Polar\Models\Components;

trait ManagesCustomer
{
    /**
     * Create a customer record for the billable model.
     *
     * @param  array<string, string|int>  $attributes
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
        if (is_null($this->customer) || is_null($this->customer->polar_id)) {
            throw InvalidCustomer::notYetCreated($this);
        }

        $service = app(PolarService::class);
        $response = $service->createCustomerSession(new Components\CustomerSessionCreate(
            customerId: $this->customer->polar_id,
        ));

        if (! $response) {
            throw new PolarApiError('Failed to create customer session');
        }

        return $response->customerPortalUrl;
    }
}
