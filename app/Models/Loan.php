<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Carbon\CarbonImmutable;
use Database\Factories\LoanFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $interest_rate
 * @property string $rate_type
 * @property int $term_months
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\LoanFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereInterestRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereRateType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereTermMonths($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Loan whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
final class Loan extends Model
{
    /** @use HasFactory<LoanFactory> */
    use Accountable, HasFactory;
}
