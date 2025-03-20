<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use App\Observers\TransactionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

#[ObservedBy(TransactionObserver::class)]
final class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * The account that the transaction belongs to.
     *
     * @return BelongsTo<Account, covariant $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * The category that the transaction belongs to.
     *
     * @return BelongsTo<Category, covariant $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The merchant that the transaction belongs to.
     *
     * @return BelongsTo<Merchant, covariant $this>
     */
    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TransactionStatus::class,
            'type' => TransactionType::class,
            'dated_at' => 'datetime',
            'enriched_at' => 'datetime',
        ];
    }
}
