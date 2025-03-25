<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Category */
final class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->public_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'color' => $this->color,
            'description' => $this->description,
            'isSystem' => $this->is_system,
            'classification' => $this->when($request->route()->named('categories.index'), fn () => $this->classification),
            'parentId' => $this->when($request->route()->named('categories.index'), fn () => $this->parent?->public_id ?? null),
            'permissions' => $this->when($request->route()->named('categories.index'), fn (): array => [
                'canUpdate' => $request->user()->can('update', $this->resource),
                'canDelete' => $request->user()->can('delete', $this->resource),
            ]),
            'hasParent' => $this->when($request->route()->named('categories.index'), fn () => $this->parent()->exists()),
            'children' => $this->whenLoaded('children', fn () => $this->children->map(fn (Category $category): CategoryResource => new CategoryResource($category))),
        ];
    }
}
