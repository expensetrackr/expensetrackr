<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Account;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait Accountable
{
    /**
     * The account that this depository belongs to.
     *
     * @return MorphOne<Account, covariant $this>
     */
    public function account(): MorphOne
    {
        return $this->morphOne(Account::class, 'accountable');
    }
}
