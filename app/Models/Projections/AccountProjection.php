<?php

declare(strict_types=1);

namespace App\Models\Projections;

use App\Models\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Date;
use TimothePearce\TimeSeries\Contracts\ProjectionContract;
use TimothePearce\TimeSeries\Models\Projection;

final class AccountProjection extends Projection implements ProjectionContract
{
    /**
     * The projected periods.
     */
    public array $periods = ['1 day'];

    /**
     * The projection default content.
     */
    public function defaultContent(): array
    {
        return [
            'current_balance' => 0,
        ];
    }

    /**
     * The "created" hook for projectable models.
     */
    public function projectableCreated(array $content, Model $model): array
    {
        return [
            'current_balance' => $content['current_balance'],
        ];
    }

    /**
     * The "updated" hook for projectable models.
     */
    public function projectableUpdated(array $content, Model $model): array
    {
        return [
            'current_balance' => $content['current_balance'],
        ];
    }

    /**
     * The projection key.
     */
    public function key(Account $model): string
    {
        return $model->workspace->public_id;
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        parent::booted();

        // Hacky way to get Carbon to work with the projection.
        Date::use(Carbon::class);
    }
}
