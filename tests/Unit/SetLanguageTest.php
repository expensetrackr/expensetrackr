<?php

declare(strict_types=1);

use App\Http\Middleware\SetLanguage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

it('sets the chosen language', function () {
    session()->put('language', 'es');

    (new SetLanguage())->handle(new Request(), function ($request) {
        expect(app()->getLocale())->toBe('es');

        return new Response();
    });
});
