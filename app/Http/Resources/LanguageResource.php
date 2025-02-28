<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Language */
final class LanguageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, string>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->value,
            'name' => $this->getLabel(),
        ];
    }
}
