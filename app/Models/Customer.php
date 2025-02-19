<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\Billable as BillableContract;
use Carbon\CarbonInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property int $billable_id
 * @property string $billable_type
 * @property string|null $polar_id
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read BillableContract $billable
 *
 * @method static Builder<static>|Customer newModelQuery()
 * @method static Builder<static>|Customer newQuery()
 * @method static Builder<static>|Customer query()
 *
 * @mixin Eloquent
 */
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
