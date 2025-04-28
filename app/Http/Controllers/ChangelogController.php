<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Changelog;
use Inertia\Inertia;
use Inertia\Response;

final class ChangelogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $changelogs = Changelog::latest('published_at')->published()->get()->toResourceCollection();

        return Inertia::render('changelog/page', [
            'changelogs' => $changelogs,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Changelog $changelog): Response
    {
        if (! $changelog->published_at) {
            abort(404);
        }

        return Inertia::render('changelog/[slug]', [
            // @phpstan-ignore-next-line method.notFound -- method exists but PHPStan can't read this magic method
            'changelog' => $changelog->toResource()->withContent(),
        ]);
    }
}
