<?php

declare(strict_types=1);

namespace App\Actions\Transactions;

use App\Models\Category;
use App\Models\Transaction;

final class UpdateTransaction
{
    /**
     * Validate and update the given transaction.
     *
     * @param  array<string, mixed>  $input
     */
    public function handle(Transaction $transaction, array $input): void
    {
        $category = Category::query()
            ->wherePublicId($input['category_id'])
            ->select('id')
            ->first();

        $transaction->forceFill([
            'name' => $input['name'],
            'note' => $input['note'],
            'type' => $input['type'],
            'category_id' => $category?->id,
        ])->save();
    }
}
