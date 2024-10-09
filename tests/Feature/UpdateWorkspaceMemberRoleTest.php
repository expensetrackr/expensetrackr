<?php

declare(strict_types=1);

use App\Models\User;

test('workspace member roles can be updated', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $user->currentWorkspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'admin']
    );

    $this->put('/workspaces/'.$user->currentWorkspace->id.'/members/'.$otherUser->id, [
        'role' => 'editor',
    ]);

    expect($otherUser->fresh()->hasWorkspaceRole(
        $user->currentWorkspace->fresh(), 'editor'
    ))->toBeTrue();
});

test('only workspace owner can update workspace member roles', function () {
    $user = User::factory()->withPersonalWorkspace()->create();

    $user->currentWorkspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'admin']
    );

    $this->actingAs($otherUser);

    $this->put('/workspaces/'.$user->currentWorkspace->id.'/members/'.$otherUser->id, [
        'role' => 'editor',
    ]);

    expect($otherUser->fresh()->hasWorkspaceRole(
        $user->currentWorkspace->fresh(), 'admin'
    ))->toBeTrue();
});
