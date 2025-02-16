<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

final class PrivacyPolicyController
{
    /**
     * Show the privacy policy for the application.
     */
    public function show(): Response
    {
        $policyFile = type(localizedMarkdownPath('policy.md'))->asString();

        return Inertia::render('privacy-policy', [
            'policy' => Str::markdown(type(file_get_contents($policyFile))->asString()),
        ]);
    }
}
