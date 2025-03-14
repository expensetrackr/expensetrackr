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
     * The resource that this resource collects.
     *
     * @var string
     */
    public $collects = Account::class;

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
            'currencyCode' => $this->currency_code,
            'initialBalance' => $this->initial_balance,
            'currentBalance' => $this->current_balance,
            'isDefault' => $this->is_default,
            'publicId' => $this->public_id,
            'externalId' => $this->external_id,
            'institution' => $this->bankConnection ? [
                'logoUrl' => $this->bankConnection->institution_logo_url,
                'status' => $this->bankConnection->is_active ? 'active' : 'inactive',
            ] : null,
        ];
    }
}
