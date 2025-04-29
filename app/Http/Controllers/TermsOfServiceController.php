<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class TermsOfServiceController extends Controller
{
    /**
     * Show the terms of service for the application.
     */
    public function show(): Response
    {
        $termsFile = type(localizedMarkdownPath('terms.md'))->asString();
        $content = Str::markdown(type(file_get_contents($termsFile))->asString());
        $excerpt = Str::excerpt($content);

        return Inertia::render('terms-of-service', [
            'terms' => $content,
            'excerpt' => $excerpt,
        ]);
    }
}
