<?php

declare(strict_types=1);

namespace App\Modifiers;

use Vagebond\Runtype\Contracts\Modifiable;

final class ModelModifier implements Modifiable
{
    public function modify($instance)
    {
        $instance->showOptionalFields = true;

        return $instance;
    }
}
