<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureWorkspace
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->user()?->currentWorkspace) {
            return response()->json([
                'success' => false,
                'message' => 'No workspace selected',
            ], 400);
        }

        return $next($request);
    }
}
