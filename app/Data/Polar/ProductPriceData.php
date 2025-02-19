<?php

declare(strict_types=1);

namespace App\Data\Polar;

use App\Enums\Polar\ProductPriceAmountType;
use App\Enums\Polar\ProductPriceType;
use App\Enums\Polar\RecurringInterval;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\EnumCast;
use Spatie\LaravelData\Data;

final class ProductPriceData extends Data
{
    public function __construct(
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        #[MapInputName('modified_at')]
        public readonly ?string $modifiedAt,
        public readonly string $id,
        #[MapInputName('amount_type')]
        #[WithCast(EnumCast::class, type: ProductPriceAmountType::class)]
        public readonly ProductPriceAmountType $amountType,
        #[MapInputName('is_archived')]
        public readonly bool $isArchived,
        #[MapInputName('product_id')]
        public readonly string $productId,
        #[MapInputName('price_currency')]
        public readonly ?string $priceCurrency,
        #[MapInputName('price_amount')]
        public readonly ?int $priceAmount,
        #[WithCast(EnumCast::class, type: ProductPriceType::class)]
        public readonly ProductPriceType $type,
        #[MapInputName('recurring_interval')]
        #[WithCast(EnumCast::class, type: RecurringInterval::class)]
        public readonly ?RecurringInterval $recurringInterval,
        #[MapInputName('minimum_amount')]
        public readonly ?int $minimumAmount,
        #[MapInputName('maximum_amount')]
        public readonly ?int $maximumAmount,
        #[MapInputName('preset_amount')]
        public readonly ?int $presetAmount,
    ) {}
}
