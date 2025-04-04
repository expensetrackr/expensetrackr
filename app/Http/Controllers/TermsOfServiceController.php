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

        return Inertia::render('terms-of-service', [
            'terms' => Str::markdown(type(file_get_contents($termsFile))->asString()),
        ]);
    }
}
