<?php

declare(strict_types=1);

namespace Workspaces\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Workspaces\Workspaces;

final class Role implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! in_array($value, array_keys(Workspaces::$roles))) {
            $fail(__('The :attribute must be a valid role.'));
        }
    }
}
