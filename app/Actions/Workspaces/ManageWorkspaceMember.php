<?php

declare(strict_types=1);

namespace App\Actions\Workspaces;

use App\Events\AddingWorkspaceMember;
use App\Events\InvitingWorkspaceMember;
use App\Events\WorkspaceMemberAdded;
use App\Mail\WorkspaceInvitationMail;
use App\Models\User;
use App\Models\Workspace;
use App\Utilities\Workspaces\WorkspaceFeatures;
use Illuminate\Support\Facades\Mail;

final class ManageWorkspaceMember
{
    /**
     * Add or invite a new workspace member.
     */
    public function handle(User $user, Workspace $workspace, string $email, string $role, bool $forceDirectAdd = false): void
    {
        if (WorkspaceFeatures::sendsWorkspaceInvitations() && ! $forceDirectAdd) {
            $this->handleInvitation($workspace, $email, $role);
        } else {
            $this->handleDirectAdd($workspace, $email);
        }
    }

    /**
     * Handle workspace invitation.
     */
    private function handleInvitation(Workspace $workspace, string $email, string $role): void
    {
        InvitingWorkspaceMember::dispatch($workspace, $email, $role);

        $invitation = $workspace->invitations()->create([
            'email' => $email,
            'role' => $role,
        ]);

        Mail::to($email)->send(new WorkspaceInvitationMail($invitation));
    }

    /**
     * Handle direct workspace member addition.
     */
    private function handleDirectAdd(Workspace $workspace, string $email): void
    {
        $newWorkspaceMember = User::whereEmail($email)->firstOrFail();

        AddingWorkspaceMember::dispatch($workspace, $newWorkspaceMember);

        $workspace->members()->attach($newWorkspaceMember);

        WorkspaceMemberAdded::dispatch($workspace, $newWorkspaceMember);
    }
}
