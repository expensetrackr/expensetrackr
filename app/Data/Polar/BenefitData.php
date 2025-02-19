<?php

declare(strict_types=1);

namespace App\Data\Polar;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

final class BenefitData extends Data
{
    public function __construct(
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        #[MapInputName('modified_at')]
        public readonly ?string $modifiedAt,
        public readonly string $id,
        public readonly string $type,
        public readonly string $description,
        public readonly bool $selectable,
        public readonly bool $deletable,
        #[MapInputName('organization_id')]
        public readonly string $organizationId,
    ) {}

    /**
     * Get the validation rules that apply to the data.
     *
     * @return array<string, array<int, string>>
     */
    public static function rules(): array
    {
        return [
            'created_at' => ['required', 'string'],
            'modified_at' => ['nullable', 'string'],
            'id' => ['required', 'string'],
            'type' => ['required', 'string', 'in:custom,ads,discord,github_repository,downloadables,license_keys'],
            'description' => ['required', 'string'],
            'selectable' => ['required', 'boolean'],
            'deletable' => ['required', 'boolean'],
            'organization_id' => ['required', 'string'],
        ];
    }
}
