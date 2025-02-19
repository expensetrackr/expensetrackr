<?php

declare(strict_types=1);

namespace App\Data\Polar;

use App\Enums\MediaService;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Url;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\EnumCast;
use Spatie\LaravelData\Data;

final class MediaData extends Data
{
    public function __construct(
        public readonly string $id,
        #[MapInputName('organization_id')]
        public readonly string $organizationId,
        public readonly string $name,
        public readonly string $path,
        #[MapInputName('mime_type')]
        public readonly string $mimeType,
        public readonly int $size,
        #[MapInputName('storage_version')]
        public readonly ?string $storageVersion,
        #[MapInputName('checksum_etag')]
        public readonly ?string $checksumEtag,
        #[MapInputName('checksum_sha256_base64')]
        public readonly ?string $checksumSha256Base64,
        #[MapInputName('checksum_sha256_hex')]
        public readonly ?string $checksumSha256Hex,
        #[MapInputName('last_modified_at')]
        public readonly ?string $lastModifiedAt,
        public readonly ?string $version,
        #[WithCast(EnumCast::class, type: MediaService::class)]
        public readonly MediaService $service,
        #[MapInputName('is_uploaded')]
        public readonly bool $isUploaded,
        #[MapInputName('created_at')]
        public readonly string $createdAt,
        #[MapInputName('size_readable')]
        public readonly string $sizeReadable,
        #[MapInputName('public_url')]
        #[Url]
        public readonly string $publicUrl,
    ) {}
}
