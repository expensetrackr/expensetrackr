<?php

declare(strict_types=1);

use App\Models\User;

test('users can leave workspaces', function () {
    $user = User::factory()->withPersonalWorkspace()->create();

    $user->currentWorkspace->users()->attach(
        $otherUser = User::factory()->create(), ['role' => 'admin']
    );

    $this->actingAs($otherUser);

    $this->delete('/workspaces/'.$user->currentWorkspace->id.'/members/'.$otherUser->id);

    expect($user->currentWorkspace->fresh()->users)->toHaveCount(0);
});

test('workspace owners cant leave their own workspace', function () {
    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $response = $this->delete('/workspaces/'.$user->currentWorkspace->id.'/members/'.$user->id);

    $response->assertSessionHasErrorsIn('removeWorkspaceMember', ['workspace']);

    expect($user->currentWorkspace->fresh())->not->toBeNull();
});
