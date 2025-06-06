<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Account */
final class AccountResource extends JsonResource
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
            'description' => $this->description,
            'currencyCode' => $this->currency_code,
            'baseCurrency' => $this->base_currency,
            'currencyRate' => $this->currency_rate,
            'initialBalance' => $this->initial_balance,
            'baseInitialBalance' => $this->base_initial_balance,
            'currentBalance' => $this->current_balance,
            'baseCurrentBalance' => $this->base_current_balance,
            'isDefault' => $this->is_default,
            'externalId' => $this->external_id,
            'connection' => new BankConnectionResource($this->whenLoaded('bankConnection')),
            'transactions' => TransactionResource::collection($this->whenLoaded('transactions')),
        ];
    }
}
