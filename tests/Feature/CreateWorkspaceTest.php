<?php

declare(strict_types=1);

use App\Models\User;

test('workspaces can be created', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $this->post('/workspaces', [
        'name' => 'Test Workspace',
    ]);

    expect($user->fresh()->ownedWorkspaces)->toHaveCount(2)
        ->and($user->fresh()->ownedWorkspaces()->latest('id')->first()->name)->toEqual('Test Workspace');
});
