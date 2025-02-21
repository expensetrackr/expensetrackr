<?php

declare(strict_types=1);

namespace App\Concerns\Polar;

use Illuminate\Database\Eloquent\Model;

/** @mixin Model */
trait Billable
{
    use ManagesCheckouts;
    use ManagesCustomer;
    use ManagesOrders;
    use ManagesSubscription;
}
