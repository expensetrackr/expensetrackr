<?php

declare(strict_types=1);

namespace Workspaces\Facades;

use Illuminate\Support\Facades\Facade;

final class Workspaces extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'workspaces';
    }
}
