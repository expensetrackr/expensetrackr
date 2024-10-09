<?php

declare(strict_types=1);

namespace Workspaces;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InertiaManager
{
    /**
     * The registered rendering callbacks.
     */
    private array $renderingCallbacks = [];

    /**
     * Render the given Inertia page.
     */
    public function render(Request $request, string $page, array $data = []): Response
    {
        if (isset($this->renderingCallbacks[$page])) {
            foreach ($this->renderingCallbacks[$page] as $callback) {
                $data = $callback($request, $data);
            }
        }

        return Inertia::render($page, $data);
    }

    /**
     * Register a rendering callback.
     */
    public function whenRendering(string $page, callable $callback): self
    {
        $this->renderingCallbacks[$page][] = $callback;

        return $this;
    }
}
