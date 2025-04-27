<?php

declare(strict_types=1);

namespace App\Filament\Resources\ChangelogResource\Pages;

use App\Filament\Resources\ChangelogResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateChangelog extends CreateRecord
{
    protected static string $resource = ChangelogResource::class;
}
