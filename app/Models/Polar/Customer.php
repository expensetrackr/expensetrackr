<?php

declare(strict_types=1);

namespace App\Models\Polar;

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
 * @method static Builder<static>|Customer whereBillableId($value)
 * @method static Builder<static>|Customer whereBillableType($value)
 * @method static Builder<static>|Customer whereCreatedAt($value)
 * @method static Builder<static>|Customer whereId($value)
 * @method static Builder<static>|Customer wherePolarId($value)
 * @method static Builder<static>|Customer whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class Customer extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'polar_customers';

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
