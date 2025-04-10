<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Akaunting\Money\Currency;
use Akaunting\Money\Money as AkauntingMoney;

final readonly class Money
{
    private AkauntingMoney $money;

    public function __construct(
        public string $amount,
        public string $currency,
    ) {
        $this->money = new AkauntingMoney($amount, new Currency($currency));
    }

    public function format(): string
    {
        return $this->money->format();
    }

    /**
     * @return array<string, string>
     */
    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
            'formatted' => $this->format(),
        ];
    }
}
