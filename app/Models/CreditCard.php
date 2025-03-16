<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\Accountable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $available_credit
 * @property string $minimum_payment
 * @property string $apr
 * @property string $annual_fee
 * @property int $expires_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Account|null $account
 *
 * @method static \Database\Factories\CreditCardFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereAnnualFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereApr($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereAvailableCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereMinimumPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CreditCard whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class CreditCard extends Model
{
    /** @use HasFactory<\Database\Factories\CreditCardFactory> */
    use Accountable, HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'timestamp',
        ];
    }
}
