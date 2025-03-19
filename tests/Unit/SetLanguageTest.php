<?php

declare(strict_types=1);

use App\Http\Middleware\HandleLanguageMiddleware;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

it('sets the chosen language', function () {
    session()->put('language', 'es');

    (new HandleLanguageMiddleware())->handle(new Request(), function ($request) {
        expect(app()->getLocale())->toBe('es');

        return new Response();
    });
});
