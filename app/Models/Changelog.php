<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $title
 * @property string $public_id
 * @property string $content
 * @property string|null $excerpt
 * @property \Carbon\CarbonImmutable|null $published_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 *
 * @method static \Database\Factories\ChangelogFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereExcerpt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Changelog whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class Changelog extends Model
{
    /** @use HasFactory<\Database\Factories\ChangelogFactory> */
    use HasFactory;

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
