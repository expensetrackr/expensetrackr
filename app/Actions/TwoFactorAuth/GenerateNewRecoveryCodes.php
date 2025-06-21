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
     * @return Collection<int, string>
     */
    public function __invoke(): Collection
    {
        $codes = collect();

        while ($codes->count() < 8) {
            $code = $this->generate();

            if (! $codes->contains($code)) {
                $codes->push($code);
            }
        }

        return $codes;
    }

    private function generate(): string
    {
        return Str::random(10).'-'.Str::random(10);
    }
}
