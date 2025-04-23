<?php

declare(strict_types=1);

namespace App\Filters;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

/** @implements Filter<Transaction>*/
final class FiltersTransactionsByAccount implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        if (is_string($value)) {
            $query->whereHas('account', function (Builder $query) use ($value): void {
                $query->where('public_id', $value);
            });
        }
    }
}
