<?php

declare(strict_types=1);

namespace App\Events\Polar;

use App\Models\Polar\Subscription;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class SubscriptionCreated
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        /**
         * The billable entity.
         */
        public Model $billable,
        /**
         * The order entity.
         */
        public Subscription $subscription,
        /**
         * The payload array.
         */
        public array $payload
    ) {}
}
