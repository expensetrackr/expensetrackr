<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\Shared\Language;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class HandleLanguageMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale(Language::tryFrom(type(session()->get('language', type(config('app.locale'))->asString()))->asString())->value ?? type(config('app.locale'))->asString());

        return $next($request);
    }
}
