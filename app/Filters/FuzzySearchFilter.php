<?php

declare(strict_types=1);

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * @template TModelClass of Model
 *
 * @implements Filter<TModelClass>
 */
final class FuzzySearchFilter implements Filter
{
    /**
     * @var string[]
     */
    private array $fields;

    public function __construct(string ...$fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param  Builder<TModelClass>  $query
     * @return Builder<TModelClass>
     */
    public function __invoke(Builder $query, mixed $value, string $property): Builder
    {
        $query->where(function (Builder $query) use ($value): void {
            foreach ($this->fields as $field) {
                $values = (array) $value;

                foreach ($values as $item) {
                    $query->orWhere($field, 'LIKE', "%{$item}%");
                }
            }
        });

        return $query;
    }
}
