<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

final class AttachedCustomFieldsData extends Data
{
    public function __construct(
        #[MapInputName('custom_field_id')]
        public readonly string $customFieldId,
        #[MapInputName('custom_field')]
        public readonly CustomFieldDetailsData $customField,
        public readonly int $order,
        public readonly bool $required,
    ) {}
}
