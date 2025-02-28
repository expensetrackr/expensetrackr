<?php

declare(strict_types=1);

namespace App\Data\Common;

use App\Enums\ToastType;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ToastData extends Data
{
    public function __construct(
        public readonly ToastType $type,
        public readonly string $message,
    ) {}

    /**
     * Create a ToastData instance from an array.
     *
     * @param  array{type: string, message: string}  $array  The array containing toast data
     * @return self Returns a ToastData instance
     */
    public static function fromArray(array $array): self
    {
        return new self(ToastType::from($array['type']), (string) $array['message']);
    }

    /**
     * Create a ToastData instance from session data.
     *
     * @param  array<mixed>  $sessionData  The session data containing toast notifications
     * @return self|null Returns a ToastData instance or null if no toast data is found
     */
    public static function fromSession(array $sessionData): ?self
    {
        $toast = collect(Arr::only($sessionData, ['error', 'warning', 'success', 'info']))
            ->filter()
            ->map(fn ($message, $key): array => [
                'type' => $key,
                'message' => $message,
            ])
            ->first();

        if (! $toast) {
            return null;
        }

        $message = $toast['message'];
        if (! is_string($message)) {
            $message = is_scalar($message) ? (string) $message : (json_encode($message) ?: '');
        }

        return new self(
            ToastType::from($toast['type']),
            $message
        );
    }

    /**
     * Create a collection of ToastData instances from session data.
     *
     * @param  array<string, mixed>  $sessionData  The session data containing toast notifications
     * @return Collection<int, self> Returns a collection of ToastData instances
     */
    public static function collectionFromSession(array $sessionData): Collection
    {
        return collect(Arr::only($sessionData, ['error', 'warning', 'success', 'info']))
            ->filter()
            ->map(function ($message, $type): ToastData {
                if (! is_string($message)) {
                    $message = is_scalar($message) ? (string) $message : (json_encode($message) ?: '');
                }

                return new self(
                    ToastType::from($type),
                    $message
                );
            });
    }
}
