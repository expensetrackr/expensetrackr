<?php

declare(strict_types=1);

use Illuminate\Support\Arr;

if (! function_exists('localizedMarkdownPath')) {
    /**
     * Find the path to a localized Markdown resource.
     */
    function localizedMarkdownPath(string $name): ?string
    {
        $localName = preg_replace('#(\.md)$#i', '.'.app()->getLocale().'$1', $name);

        return Arr::first([
            resource_path("markdown/$localName"),
            resource_path("markdown/$name"),
        ], fn ($path): bool => file_exists($path));
    }
}

if (! function_exists('toCents')) {
    /**
     * Convert an amount to cents.
     *
     * @param  string  $amount  The amount to convert
     */
    function toCents(string $amount): int
    {
        return (int) str_replace('.', '', $amount);
    }
}
