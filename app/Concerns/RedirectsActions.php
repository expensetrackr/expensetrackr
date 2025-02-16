<?php

declare(strict_types=1);

namespace App\Concerns;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

trait RedirectsActions
{
    /**
     * Get the redirect response for the given action.
     *
     * @param  object  $action  The action object containing redirect information
     */
    public function redirectPath(object $action): Application|RedirectResponse|Redirector|Response
    {
        if (method_exists($action, 'redirectTo')) {
            $response = $action->redirectTo();
        } else {
            $response = property_exists($action, 'redirectTo')
                ? $action->redirectTo
                : config('fortify.home');
        }

        if ($response instanceof Response) {
            return $response;
        }

        return redirect(is_string($response) ? $response : type(config('fortify.home'))->asString());
    }
}
