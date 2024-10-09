<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Workspaces\Features;
use Workspaces\Mail\WorkspaceInvitation;

test('workspace members can be invited to workspace', function () {
    Mail::fake();

    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $this->post('/workspaces/'.$user->currentWorkspace->id.'/members', [
        'email' => 'test@example.com',
        'role' => 'admin',
    ]);

    Mail::assertSent(WorkspaceInvitation::class);

    expect($user->currentWorkspace->fresh()->workspaceInvitations)->toHaveCount(1);
})->skip(function () {
    return ! Features::sendsWorkspaceInvitations();
}, 'Workspace invitations not enabled.');

test('workspace member invitations can be cancelled', function () {
    Mail::fake();

    $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());

    $invitation = $user->currentWorkspace->workspaceInvitations()->create([
        'email' => 'test@example.com',
        'role' => 'admin',
    ]);

    $this->delete('/workspace-invitations/'.$invitation->id);

    expect($user->currentWorkspace->fresh()->workspaceInvitations)->toHaveCount(0);
})->skip(function () {
    return ! Features::sendsWorkspaceInvitations();
}, 'Workspace invitations not enabled.');
