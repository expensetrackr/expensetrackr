<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class ProductData extends Data
{
    public function __construct(
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        #[MapInputName('modified_at')]
        public readonly ?string $modifiedAt,
        public readonly string $id,
        public readonly string $name,
        public readonly ?string $description,
        #[MapInputName('is_recurring')]
        public readonly bool $isRecurring,
        #[MapInputName('is_archived')]
        public readonly bool $isArchived,
        #[MapInputName('organization_id')]
        public readonly string $organizationId,
        /** @var DataCollection<int, ProductPriceData> */
        #[DataCollectionOf(ProductPriceData::class)]
        public readonly DataCollection $prices,
        /** @var DataCollection<int, BenefitData> */
        #[DataCollectionOf(BenefitData::class)]
        public readonly DataCollection $benefits,
        /** @var DataCollection<int, MediaData> */
        #[DataCollectionOf(MediaData::class)]
        public readonly DataCollection $medias,
    ) {}
}
