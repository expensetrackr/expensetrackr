<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/** @mixin Account */
#[TypeScript]
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
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'currency_code' => $this->currency_code,
            'initial_balance' => $this->initial_balance,
            'current_balance' => $this->current_balance,
            'is_default' => $this->is_default,
            'public_id' => $this->public_id,
            'external_id' => $this->external_id,
        ];
    }
}
