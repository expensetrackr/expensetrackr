<?php

declare(strict_types=1);

use App\Models\User;
use App\Models\Workspace;

test('workspaces can be deleted', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $user->ownedWorkspaces()->save($workspace = Workspace::factory()->make([
        'personal_workspace' => false,
    ]));

    $workspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'test-role']
    );

    $this->delete('/workspaces/'.$workspace->id);

    expect($workspace->fresh())->toBeNull()
        ->and($otherUser->fresh()->workspaces)->toHaveCount(0);
});

test('personal workspaces cant be deleted', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $this->delete('/workspaces/'.$user->currentWorkspace->id);

    expect($user->currentWorkspace->fresh())->not->toBeNull();
});
