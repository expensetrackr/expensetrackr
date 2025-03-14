<?php

namespace App\Http\Resources;

use App\Models\BankConnection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BankConnection */
class BankConnectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'institutionName' => $this->institution_name,
            'institutionLogoUrl' => $this->institution_logo_url,
            'providerType' => $this->provider_type,
            'isActive' => $this->is_active,
        ];
    }
}
