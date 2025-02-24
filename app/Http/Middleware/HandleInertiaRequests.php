<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\Language;
use App\Http\Resources\LanguageResource;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<array-key, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
                'query' => $request->query(),
            ],
            'toast' => collect(Arr::only($request->session()->all(), ['error', 'warning', 'success', 'info']))
                ->mapWithKeys(fn ($notification, $key): array => ['type' => $key, 'message' => $notification]),
            'language' => session()->get('language', app()->getLocale()),
            'languages' => LanguageResource::collection(Language::cases()),
            'translations' => function () {
                $locale = app()->getLocale();
                $files = File::allFiles(base_path('lang/'.$locale));

                // Get last modified time of all translation files
                $lastModified = collect($files)->max(fn ($file) => $file->getMTime());

                $cacheKey = 'translations.'.$locale;
                $lastModifiedKey = 'translations_modified.'.$locale;

                // If cached last modified time differs, invalidate cache
                if (cache()->get($lastModifiedKey) !== $lastModified) {
                    cache()->forget($cacheKey);
                }

                return cache()->remember($cacheKey, now()->addYear(), function () use ($files, $lastModified, $lastModifiedKey) {
                    cache()->forever($lastModifiedKey, $lastModified);

                    return collect($files)->flatMap(function ($file) {
                        $fileContents = File::getRequire($file->getRealPath());

                        return is_array($fileContents) ? Arr::dot($fileContents, $file->getBasename('.'.$file->getExtension()).'.') : [];
                    });
                });
            },
        ]);
    }
}
