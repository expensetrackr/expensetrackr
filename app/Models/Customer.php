<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

final class Customer extends Model
{
    /**
     * Get the billable model related to the customer.
     *
     * @return MorphTo<Model, covariant $this>
     */
    public function billable(): MorphTo
    {
        return $this->morphTo();
    }
}
