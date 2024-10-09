<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Http\Request;
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
    public function show(Request $request): Response
    {
        $termsFile = Workspaces::localizedMarkdownPath('terms.md');

        return Inertia::render('TermsOfService', [
            'terms' => Str::markdown(file_get_contents($termsFile)),
        ]);
    }
}
