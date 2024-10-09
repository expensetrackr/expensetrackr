<?php

declare(strict_types=1);

namespace Workspaces\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use Workspaces\WorkspaceInvitation as WorkspaceInvitationModel;

final class WorkspaceInvitation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The workspace invitation instance.
     */
    public WorkspaceInvitationModel $invitation;

    /**
     * Create a new message instance.
     */
    public function __construct(WorkspaceInvitationModel $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): self
    {
        return $this->markdown('emails.workspace-invitation', ['acceptUrl' => URL::signedRoute('workspace-invitations.accept', [
            'invitation' => $this->invitation,
        ])])->subject(__('Workspace Invitation'));
    }
}
