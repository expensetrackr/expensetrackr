<?php

declare(strict_types=1);

namespace App\Actions\TwoFactorAuth;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

final class GenerateNewRecoveryCodes
{
    /**
     * Generate new recovery codes for the user.
     *
     * @param  mixed  $user
     * @return Collection<int, string>
     */
    public function __invoke(): Collection
    {
        return Collection::times(8, fn () => $this->generate());
    }

    public function generate()
    {
        return Str::random(10).'-'.Str::random(10);
    }
}
