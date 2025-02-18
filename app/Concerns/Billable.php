<?php

declare(strict_types=1);

namespace App\Concerns;

trait Billable
{
    use ManagesCheckouts;
    use ManagesCustomer;
}
