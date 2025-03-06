<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\ToastType;
use Illuminate\Support\Arr;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ToastData extends Data
{
    public function __construct(
        public readonly ToastType $type,
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?int $duration = null,
    ) {}

    /**
     * Create a ToastData instance from an array.
     *
     * @param  array{type: string, title: string, description: string|null, duration: int|null}  $array  The array containing toast data
     * @return self Returns a ToastData instance
     */
    public static function fromArray(array $array): self
    {
        return new self(ToastType::from($array['type']), (string) $array['title'], $array['description'] ?? null, $array['duration'] ?? null);
    }

    /**
     * Create a ToastData instance from session data.
     *
     * @param  array<mixed>  $sessionData  The session data containing toast notifications
     * @return self|null Returns a ToastData instance or null if no toast data is found
     */
    public static function fromSession(array $sessionData): ?self
    {
        $toast = collect(Arr::only($sessionData, ['toast']))
            ->filter()
            ->map(fn ($content): array => [
                'type' => $content['type'],
                'title' => $content['title'],
                'description' => $content['description'] ?? null,
                'duration' => $content['duration'] ?? null,
            ])
            ->first();

        if (! $toast) {
            return null;
        }

        $title = $toast['title'];
        if (! is_string($title)) {
            $title = is_scalar($title) ? (string) $title : (json_encode($title) ?: '');
        }

        $description = $toast['description'];
        if (! is_string($description)) {
            $description = is_scalar($description) ? (string) $description : (json_encode($description) ?: '');
        }

        return new self(
            ToastType::from($toast['type']),
            $title,
            $description,
            $toast['duration'],
        );
    }
}
