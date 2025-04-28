<?php

declare(strict_types=1);

namespace App\Utilities\Translations;

use App\Enums\Shared\Language;
use App\Http\Resources\LanguageResource;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

final class TranslationManager
{
    /**
     * Get all translations for the current locale with caching.
     *
     * @return array<string, mixed>
     */
    public static function getAllTranslations(): array
    {
        $locale = app()->getLocale();
        $files = File::allFiles(base_path("lang/$locale"));

        // Get last modified time of all translation files
        $lastModified = collect($files)->max(fn ($file) => $file->getMTime());

        $cacheKey = "translations.$locale";
        $lastModifiedKey = "translations_modified.$locale";

        // If cached last modified time differs, invalidate cache
        if (Cache::get($lastModifiedKey) !== $lastModified) {
            Cache::forget($cacheKey);
        }

        /** @var array<string, mixed> */
        return Cache::remember($cacheKey, now()->addYear(), function () use ($files, $lastModified, $lastModifiedKey) {
            Cache::forever($lastModifiedKey, $lastModified);

            return collect($files)->flatMap(function ($file) {
                $fileContents = File::getRequire($file->getRealPath());

                return is_array($fileContents) ? Arr::dot($fileContents, $file->getBasename('.'.$file->getExtension()).'.') : [];
            })->toArray();
        });
    }

    /**
     * Get the current language from the session.
     */
    public static function getLanguage(): string
    {
        /** @var string */
        return session()->get('language', app()->getLocale());
    }

    /**
     * Get the current language from the session.
     *
     * @return array<string, mixed>
     */
    public static function getLanguages(Request $request): array
    {
        /** @var array<string, mixed> */
        return LanguageResource::collection(Language::cases())->toArray($request);
    }
}
