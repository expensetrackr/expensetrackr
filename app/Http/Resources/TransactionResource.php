<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Transaction */
final class TransactionResource extends JsonResource
{
    public bool $showOptionalFields = true;

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
            'type' => $this->type->value,
            'baseAmount' => $this->base_amount,
            'baseCurrency' => $this->base_currency,
            'currencyRate' => $this->currency_rate,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'isRecurring' => $this->is_recurring,
            'isManual' => $this->is_manual,
            'datedAt' => $this->dated_at,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->public_id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                    'color' => $this->category->color,
                ];
            }),
        ];
    }
}
