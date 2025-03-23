<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Transaction */
final class TransactionResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'note' => $this->note,
            'type' => $this->type->value ?? null,
            'baseAmount' => $this->base_amount,
            'baseCurrency' => $this->base_currency,
            'currencyRate' => $this->currency_rate,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'isRecurring' => $this->is_recurring ?? null,
            'isManual' => $this->is_manual ?? null,
            'datedAt' => $this->dated_at,
            'account' => $this->whenLoaded('account', fn (): AccountResource => new AccountResource($this->account)),
            'category' => $this->whenLoaded('category', fn (): CategoryResource => new CategoryResource($this->category)),
            'merchant' => $this->whenLoaded('merchant', fn (): MerchantResource => new MerchantResource($this->merchant)),
        ];
    }
}
