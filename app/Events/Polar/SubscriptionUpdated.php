<?php

declare(strict_types=1);

namespace App\Events\Polar;

use App\Models\Polar\Subscription;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class SubscriptionUpdated
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
         * The subscription instance.
         */
        public Subscription $subscription,
        /**
         * The payload array.
         *
         * @var array<string, mixed>
         */
        public array $payload
    ) {}
}
