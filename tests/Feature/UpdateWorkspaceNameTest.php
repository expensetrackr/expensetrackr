<?php

declare(strict_types=1);

use App\Models\User;

test('workspace names can be updated', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $this->put('/workspaces/'.$user->currentWorkspace->id, [
        'name' => 'Test Workspace',
    ]);

    expect($user->fresh()->ownedWorkspaces)->toHaveCount(1)
        ->and($user->currentWorkspace->fresh()->name)->toEqual('Test Workspace');
});
