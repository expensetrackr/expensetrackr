<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * @property int $id
 * @property string $balance
 * @property int $account_id
 * @property int $workspace_id
 * @property \Carbon\CarbonImmutable $dated_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read Account $account
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\AccountBalanceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereDatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class AccountBalance extends Model
{
    /** @use HasFactory<\Database\Factories\AccountBalanceFactory> */
    use HasFactory, WorkspaceOwned;

    /**
     * The valid intervals for balance snapshots.
     *
     * @var array<string>
     */
    private const array VALID_INTERVALS = [
        'year',
        'month',
        'week',
        'day',
        'hour',
    ];

    /**
     * Get the account that the balance belongs to.
     *
     * @return BelongsTo<Account, covariant $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Scope a query to only include records within a given period.
     * This scope is optimized to return only significant balance changes within the period.
     *
     * @param  Builder<AccountBalance>  $query
     */
    #[Scope]
    public function period(Builder $query, ?object $period): void
    {
        if (! $period) {
            return;
        }

        // Get the last balance before the period starts to establish initial balance
        $query->where(function ($q) use ($period) {
            $q->where('dated_at', '<=', $period->end_date)
                ->where(function ($inner) use ($period) {
                    $inner->where('dated_at', '>=', $period->start_date)
                        ->orWhere(function ($last) use ($period) {
                            $last->where('dated_at', '<', $period->start_date)
                                ->whereNotExists(function ($exists) use ($period) {
                                    $exists->select(DB::raw(1))
                                        ->from('account_balances as newer')
                                        ->whereColumn('newer.account_id', 'account_balances.account_id')
                                        ->where('newer.dated_at', '>', 'account_balances.dated_at')
                                        ->where('newer.dated_at', '<', $period->start_date);
                                });
                        });
                });
        });
    }

    /**
     * Scope to get balance snapshots at regular intervals.
     * Returns a complete series with 0 balance for empty periods.
     *
     * @param  Builder<AccountBalance>  $query
     * @param  'year'|'month'|'week'|'day'|'hour'  $interval  The interval for snapshots
     * @param  ?object  $period  The period to generate series for
     *
     * @throws InvalidArgumentException If invalid interval is provided
     */
    #[Scope]
    public function snapshots(Builder $query, string $interval = 'month', ?object $period = null): void
    {
        if (! in_array($interval, self::VALID_INTERVALS, true)) {
            throw new InvalidArgumentException(
                sprintf(
                    'Invalid interval provided. Must be one of: %s',
                    implode(', ', self::VALID_INTERVALS)
                )
            );
        }

        // Generate series of timestamps for the period
        $seriesSql = match ($interval) {
            'hour' => "
                SELECT generate_series(
                    DATE_TRUNC('hour', :start_date::timestamp),
                    DATE_TRUNC('hour', :end_date::timestamp),
                    '1 hour'::interval
                ) as timestamp
            ",
            'day' => "
                SELECT generate_series(
                    DATE_TRUNC('day', :start_date::timestamp),
                    DATE_TRUNC('day', :end_date::timestamp),
                    '1 day'::interval
                ) as timestamp
            ",
            'week' => "
                SELECT generate_series(
                    DATE_TRUNC('week', :start_date::timestamp),
                    DATE_TRUNC('week', :end_date::timestamp),
                    '1 week'::interval
                ) as timestamp
            ",
            'month' => "
                SELECT generate_series(
                    DATE_TRUNC('month', :start_date::timestamp),
                    DATE_TRUNC('month', :end_date::timestamp),
                    '1 month'::interval
                ) as timestamp
            ",
            'year' => "
                SELECT generate_series(
                    DATE_TRUNC('year', :start_date::timestamp),
                    DATE_TRUNC('year', :end_date::timestamp),
                    '1 year'::interval
                ) as timestamp
            ",
        };

        $startDate = $period?->start_date ?? now()->startOfYear();
        $endDate = $period?->end_date ?? now();

        $query->select([
            'series.timestamp',
            DB::raw('COALESCE(account_balances.balance, 0) as balance'),
            'account_balances.account_id',
        ])
            ->rightJoin(DB::raw("({$seriesSql}) as series"), function ($join) use ($interval) {
                $join->on(
                    DB::raw("DATE_TRUNC('$interval', account_balances.dated_at)"),
                    '=',
                    'series.timestamp'
                );
            })
            ->addBinding([$startDate, $endDate], 'join')
            ->orderBy('series.timestamp');
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dated_at' => 'datetime',
        ];
    }
}
