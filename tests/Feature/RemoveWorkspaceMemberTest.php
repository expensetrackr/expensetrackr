<?php

declare(strict_types=1);

use App\Models\User;

test('workspace members can be removed from workspaces', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $user->currentWorkspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'admin']
    );

    $this->delete('/workspaces/'.$user->currentWorkspace->id.'/members/'.$otherUser->id);

    expect($user->currentWorkspace->fresh()->users)->toHaveCount(0);
});

test('only workspace owner can remove workspace members', function () {
    $user = User::factory()->withPersonalWorkspace()->create();

    $user->currentWorkspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'admin']
    );

    $this->actingAs($otherUser);

    $response = $this->delete('/workspaces/'.$user->currentWorkspace->id.'/members/'.$user->id);

    $response->assertStatus(403);
});
