<?php

declare(strict_types=1);

namespace Workspaces\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Response;
use Workspaces\Workspaces;

final class ApiTokenController extends Controller
{
    /**
     * Show the user API token screen.
     */
    public function index(Request $request): Response
    {
        return Workspaces::inertia()->render($request, 'API/Index', [
            'tokens' => $request->user()?->tokens->map(fn ($token) => $token->toArray() + [
                'last_used_ago' => $token->last_used_at?->diffForHumans(),
            ]),
            'availablePermissions' => Workspaces::$permissions,
            'defaultPermissions' => Workspaces::$defaultPermissions,
        ]);
    }

    /**
     * Create a new API token.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $token = $request->user()?->createToken(
            type($request->name)->asString(),
            Workspaces::validPermissions(type($request->input('permissions', []))->asArray())
        );

        if ($token === null) {
            return back()->withErrors([
                'name' => 'The token could not be created.',
            ]);
        }

        return back()->with('flash', [
            'token' => explode('|', $token->plainTextToken, 2)[1],
        ]);
    }

    /**
     * Update the given API token's permissions.
     */
    public function update(Request $request, string $tokenId): RedirectResponse
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string',
        ]);

        $token = $request->user()?->tokens()->where('id', $tokenId)->firstOrFail();

        $token?->forceFill([
            'abilities' => Workspaces::validPermissions(type($request->input('permissions', []))->asArray()),
        ])->save();

        return back(303);
    }

    /**
     * Delete the given API token.
     */
    public function destroy(Request $request, string $tokenId): RedirectResponse
    {
        $request->user()?->tokens()->where('id', $tokenId)->first()?->delete();

        return back(303);
    }
}
