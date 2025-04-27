<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property string|null $excerpt
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $published_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 *
 * @method static \Database\Factories\ChangelogFactory factory($count = null, $state = [])
 * @method static Builder<static>|Changelog newModelQuery()
 * @method static Builder<static>|Changelog newQuery()
 * @method static Builder<static>|Changelog query()
 * @method static Builder<static>|Changelog whereContent($value)
 * @method static Builder<static>|Changelog whereCreatedAt($value)
 * @method static Builder<static>|Changelog whereExcerpt($value)
 * @method static Builder<static>|Changelog whereId($value)
 * @method static Builder<static>|Changelog wherePublicId($value)
 * @method static Builder<static>|Changelog wherePublishedAt($value)
 * @method static Builder<static>|Changelog whereSlug($value)
 * @method static Builder<static>|Changelog whereTitle($value)
 * @method static Builder<static>|Changelog whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class Changelog extends Model
{
    /** @use HasFactory<\Database\Factories\ChangelogFactory> */
    use HasFactory, HasPrefixedId;

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Scope a query to only include published changelogs.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function published(Builder $query): void
    {
        $query->whereNotNull('published_at');
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
