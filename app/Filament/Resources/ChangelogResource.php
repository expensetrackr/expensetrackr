<?php

declare(strict_types=1);

namespace App\Filament\Resources;

use App\Filament\Resources\ChangelogResource\Pages;
use App\Models\Changelog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

final class ChangelogResource extends Resource
{
    protected static ?string $model = Changelog::class;

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $navigationGroup = 'Content';

    protected static ?string $navigationIcon = 'hugeicons-clock-01';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label(__('changelog.filament.title'))
                            ->maxLength(255)
                            ->required()
                            ->live(debounce: 500)
                            ->afterStateUpdated(function (Get $get, Set $set, ?string $old, ?string $state) {
                                if (($get('slug') ?? '') !== Str::slug((string) $old)) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state));
                            }),
                        Forms\Components\TextInput::make('slug')
                            ->label(__('changelog.filament.slug'))
                            ->required()
                            ->unique(Changelog::class, 'slug', fn ($record) => $record),
                        Forms\Components\Textarea::make('excerpt')
                            ->label(__('changelog.filament.excerpt'))
                            ->minLength(50)
                            ->maxLength(1000)
                            ->nullable()
                            ->columnSpan([
                                'sm' => 2,
                            ]),
                        Forms\Components\MarkdownEditor::make('content')
                            ->label(__('changelog.filament.content'))
                            ->required()
                            ->columnSpan([
                                'sm' => 2,
                            ]),
                        Forms\Components\DatePicker::make('published_at')
                            ->label(__('changelog.filament.published_at')),
                    ])
                    ->columns([
                        'sm' => 2,
                    ])
                    ->columnSpan(2),
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\Placeholder::make('created_at')
                            ->label(__('changelog.filament.created_at'))
                            ->content(fn (
                                ?Changelog $record
                            ): string => $record?->created_at?->diffForHumans() ?? '-'),
                        Forms\Components\Placeholder::make('updated_at')
                            ->label(__('changelog.filament.updated_at'))
                            ->content(fn (
                                ?Changelog $record
                            ): string => $record?->updated_at?->diffForHumans() ?? '-'),
                    ])
                    ->columnSpan(1),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label(__('changelog.filament.title'))
                    ->searchable()
                    ->wrap()
                    ->sortable(),
                Tables\Columns\TextColumn::make('published_at')
                    ->label(__('changelog.filament.published_at'))
                    ->date()
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\Filter::make('published_at')
                    ->form([
                        Forms\Components\DatePicker::make('published_from')
                            ->label(__('changelog.filament.published_from'))
                            ->placeholder(fn ($state): string => 'Dec 18, '.now()->subYear()->format('Y')),
                        Forms\Components\DatePicker::make('published_until')
                            ->label(__('changelog.filament.published_until'))
                            ->placeholder(fn ($state): string => now()->format('M d, Y')),
                    ])
                    ->query(fn (Builder $query, array $data) => $query
                        ->when(
                            $data['published_from'],
                            fn (Builder $query, $date): Builder => $query->whereDate('published_at', '>=', type($date)->asString()),
                        )
                        ->when(
                            $data['published_until'],
                            fn (Builder $query, $date): Builder => $query->whereDate('published_at', '<=', type($date)->asString()),
                        )),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListChangelogs::route('/'),
            'create' => Pages\CreateChangelog::route('/create'),
            'edit' => Pages\EditChangelog::route('/{record}/edit'),
        ];
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title'];
    }

    public static function getPluralModelLabel(): string
    {
        return __('changelog.filament.plural_model_label');
    }

    public static function getModelLabel(): string
    {
        return __('changelog.filament.model_label');
    }
}
