<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

/**
 * @property int $id
 * @property string $image_path
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property string|null $excerpt
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $published_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read string|null $prefixed_id
 *
 * @method static \Database\Factories\ChangelogFactory factory($count = null, $state = [])
 * @method static Builder<static>|Changelog newModelQuery()
 * @method static Builder<static>|Changelog newQuery()
 * @method static Builder<static>|Changelog query()
 * @method static Builder<static>|Changelog whereContent($value)
 * @method static Builder<static>|Changelog whereCreatedAt($value)
 * @method static Builder<static>|Changelog whereExcerpt($value)
 * @method static Builder<static>|Changelog whereId($value)
 * @method static Builder<static>|Changelog whereImagePath($value)
 * @method static Builder<static>|Changelog wherePublicId($value)
 * @method static Builder<static>|Changelog wherePublishedAt($value)
 * @method static Builder<static>|Changelog whereSlug($value)
 * @method static Builder<static>|Changelog whereTitle($value)
 * @method static Builder<static>|Changelog whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class Changelog extends Model implements Sitemapable
{
    /** @use HasFactory<\Database\Factories\ChangelogFactory> */
    use HasFactory, HasPrefixedId;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function toSitemapTag(): Url
    {
        return Url::create(route('changelog.show', $this))
            ->setLastModificationDate(
                Carbon::create($this->updated_at) ?? Carbon::now()
            );
    }

    /**
     * Get the URL to the changelog's image.
     *
     * @return Attribute<string|null, never>
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->image_path
            ? Storage::disk('s3')->url($this->image_path)
            : null);
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
