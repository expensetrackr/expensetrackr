<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Concerns\Polar\ManagesCheckouts;
use App\Concerns\Polar\ManagesCustomer;
use App\Concerns\Polar\ManagesSubscription;
use Illuminate\Database\Eloquent\Model;

/** @mixin Model */
trait Billable
{
    use ManagesCheckouts;
    use ManagesCustomer;
    use ManagesSubscription;

    /**
     * Get the customer's name that should be synced with Polar.
     */
    public function polarName(): ?string
    {
        return null;
    }

    /**
     * Get the customer's email that should be synced with Polar.
     */
    public function polarEmail(): ?string
    {
        return null;
    }
}
