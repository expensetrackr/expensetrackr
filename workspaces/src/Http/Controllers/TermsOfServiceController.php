<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Workspaces\Workspaces;

final class TermsOfServiceController extends Controller
{
    /**
     * Show the terms of service for the application.
     */
    public function show(): Response
    {
        $termsFile = type(Workspaces::localizedMarkdownPath('terms.md'))->asString();

        return Inertia::render('TermsOfService', [
            'terms' => Str::markdown(type(file_get_contents($termsFile))->asString()),
        ]);
    }
}
