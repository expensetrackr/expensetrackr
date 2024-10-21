<?php

declare(strict_types=1);

namespace Http\Controllers;

namespace Workspaces\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Workspaces\Workspaces;

final class PrivacyPolicyController extends Controller
{
    /**
     * Show the privacy policy for the application.
     */
    public function show(): Response
    {
        $policyFile = Workspaces::localizedMarkdownPath('policy.md');

        return Inertia::render('PrivacyPolicy', [
            'policy' => Str::markdown(file_get_contents($policyFile)),
        ]);
    }
}
