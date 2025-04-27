<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin \App\Models\Changelog */
final class ChangelogResource extends JsonResource
{
    private bool $appendContent = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->public_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt ?? Str::excerpt($this->content),
            'content' => $this->when($this->appendContent, fn () => Str::markdown($this->content)),
            'publishedAt' => $this->published_at,
        ];
    }

    public function withContent(bool $append = true): self
    {
        $this->appendContent = $append;

        return $this;
    }
}
