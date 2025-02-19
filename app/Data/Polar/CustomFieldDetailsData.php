<?php

declare(strict_types=1);

namespace App\Data\Polar;

use App\Enums\Polar\CustomFieldType;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\EnumCast;
use Spatie\LaravelData\Data;

final class CustomFieldDetailsData extends Data
{
    public function __construct(
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        #[MapInputName('modified_at')]
        public readonly ?string $modifiedAt,
        public readonly string $id,
        /** @var array<string, string|int|bool> */
        public readonly array $metadata,
        #[WithCast(EnumCast::class, type: CustomFieldType::class)]
        public readonly CustomFieldType $type,
        public readonly string $slug,
        public readonly string $name,
        #[MapInputName('organization_id')]
        public readonly string $organizationId,
        public readonly CustomFieldPropertiesData $properties,
    ) {}
}
