<?php

declare(strict_types=1);

namespace App\Filament\Resources\ChangelogResource\Pages;

use App\Filament\Resources\ChangelogResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

final class EditChangelog extends EditRecord
{
    protected static string $resource = ChangelogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
