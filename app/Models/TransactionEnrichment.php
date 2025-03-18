<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $merchant_name
 * @property string $merchant_id
 * @property string $category
 * @property string|null $website
 * @property string|null $icon
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Transaction> $transactions
 * @property-read int|null $transactions_count
 *
 * @method static \Database\Factories\TransactionEnrichmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereMerchantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereMerchantName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEnrichment whereWebsite($value)
 *
 * @mixin \Eloquent
 */
final class TransactionEnrichment extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionEnrichmentFactory> */
    use HasFactory;

    /**
     * The transactions that the enrichment belongs to.
     *
     * @return HasMany<Transaction, covariant $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
