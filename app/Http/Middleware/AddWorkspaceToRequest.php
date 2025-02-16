<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;

final class AddWorkspaceToRequest
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (Auth::check() && ! Context::has('currentWorkspace')) {
            Context::add('currentWorkspace', $request->user()?->currentWorkspace?->getKey());
        }

        return $next($request);
    }
}
