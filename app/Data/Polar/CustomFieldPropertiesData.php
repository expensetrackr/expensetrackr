<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class CustomFieldPropertiesData extends Data
{
    public function __construct(
        #[MapInputName('form_label')]
        #[Min(1)]
        public readonly ?string $formLabel,
        #[MapInputName('form_help_text')]
        #[Min(1)]
        public readonly ?string $formHelpText,
        #[MapInputName('form_placeholder')]
        #[Min(1)]
        public readonly ?string $formPlaceholder,
        public readonly ?bool $textarea,
        #[MapInputName('min_length')]
        public readonly ?int $minLength,
        #[MapInputName('max_length')]
        public readonly ?int $maxLength,
        public readonly ?int $ge,
        public readonly ?int $le,
        /** @var DataCollection<int, CustomFieldOptionData> */
        #[DataCollectionOf(CustomFieldOptionData::class)]
        public readonly ?DataCollection $options,
    ) {}
}
