<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

final class CustomerBillingAddressData extends Data
{
    public function __construct(
        #[MapInputName('line1')]
        public readonly ?string $line1,
        #[MapInputName('line2')]
        public readonly ?string $line2,
        #[MapInputName('postal_code')]
        public readonly ?string $postalCode,
        public readonly ?string $city,
        public readonly ?string $state,
        public readonly string $country,
    ) {}
}
