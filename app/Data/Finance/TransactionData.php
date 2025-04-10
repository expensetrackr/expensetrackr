<?php

declare(strict_types=1);

namespace App\Data\Finance;

use App\Data\Banking\TellerTransactionData;
use App\Enums\TransactionStatus;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

final class TransactionData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly ?string $note,
        public readonly TransactionStatus $status,
        public readonly string $categorySlug,
        #[MapName('base_amount')]
        public readonly ?string $baseAmount,
        #[MapName('base_currency')]
        public readonly ?string $baseCurrency,
        #[MapName('currency_rate')]
        public readonly ?string $currencyRate,
        public readonly string $amount,
        public readonly string $currency,
        #[MapName('dated_at')]
        public readonly Carbon $datedAt,
    ) {}

    public static function fromTeller(TellerTransactionData $transaction): self
    {
        return new self(
            id: $transaction->id,
            name: $transaction->description,
            note: ucwords((string) $transaction->details->counterparty->name),
            status: TransactionStatus::from($transaction->status->value),
            categorySlug: self::transformCategory($transaction->details->category),
            baseAmount: null,
            baseCurrency: null,
            currencyRate: null,
            amount: $transaction->amount,
            currency: 'USD',
            datedAt: Carbon::parse($transaction->date),
        );
    }

    /**
     * Collect transactions from Teller and filter out pending transactions.
     *
     * @param  array<TellerTransactionData>  $transactions
     * @return Collection<int, TransactionData>
     */
    public static function collectFromTeller(array $transactions): Collection
    {
        return collect($transactions)->map(fn (TellerTransactionData $transaction): TransactionData => self::fromTeller($transaction));
    }

    /**
     * Transform external category slugs to our system category slugs
     */
    public static function transformCategory(string $categorySlug): string
    {
        return match (mb_strtolower($categorySlug)) {
            // Income related
            'income', 'investment' => 'investments',

            // Housing & Utilities
            'accommodation', 'home' => 'housing',
            'utilities' => 'utilities',

            // Transportation
            'fuel', 'transport', 'transportation' => 'transportation',

            // Food related
            'groceries' => 'groceries',
            'dining', 'bar' => 'dining',

            // Shopping & Technology
            'shopping', 'clothing' => 'shopping',
            'electronics', 'phone', 'software' => 'technology',

            // Services & Business
            'advertising', 'office', 'service' => 'services',

            // Healthcare & Education
            'health' => 'healthcare',
            'education' => 'education',

            // Entertainment & Sports
            'entertainment', 'sport' => 'entertainment',

            // Financial
            'charity' => 'gifts',
            'insurance' => 'other',
            'loan' => 'loans',
            'tax' => 'other',

            // Special case
            'transfer' => 'transfer',

            // Default fallback
            'general' => 'general',
            default => 'other',
        };
    }
}
