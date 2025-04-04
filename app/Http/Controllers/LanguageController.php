<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Language;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class LanguageController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        session()->put('language', Language::tryFrom(type($request->language)->asString())->value ?? type(config('app.locale'))->asString());

        return back(303);
    }
}
