<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\WorkspaceOwned;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\PrefixedIds\Models\Concerns\HasPrefixedId;

/**
 * @property int $id
 * @property int $workspace_id
 * @property bool $is_data_enrichment_enabled
 * @property string $public_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read string|null $prefixed_id
 * @property-read Workspace $workspace
 *
 * @method static \Database\Factories\WorkspaceSettingFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting whereIsDataEnrichmentEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting wherePublicId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WorkspaceSetting whereWorkspaceId($value)
 *
 * @mixin \Eloquent
 */
final class WorkspaceSetting extends Model
{
    /** @use HasFactory<\Database\Factories\WorkspaceSettingFactory> */
    use HasFactory, HasPrefixedId, WorkspaceOwned;

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'public_id';
    }
}
