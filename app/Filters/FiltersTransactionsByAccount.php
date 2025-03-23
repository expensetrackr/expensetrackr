<?php

declare(strict_types=1);

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

final class FiltersTransactionsByAccount implements Filter
{
    public function __invoke(Builder $query, $value, string $property): void
    {
        $query->whereHas('account', function (Builder $query) use ($value): void {
            $query->where('public_id', $value);
        });
    }
}
