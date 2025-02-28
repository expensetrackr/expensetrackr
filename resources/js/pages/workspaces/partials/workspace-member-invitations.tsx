import { router } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import MailCloseIcon from "virtual:icons/ri/mail-close-line";
import { route } from "ziggy-js";

import { ActionSection } from "#/components/action-section.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { Action, getAction } from "#/utils/action.ts";

interface UserMembership extends App.Data.UserData {
    membership: {
        role: string;
    };
}

interface WorkspaceMemberInvitationsProps {
    workspace: App.Data.WorkspaceData & {
        owner: App.Data.UserData;
        invitations: App.Data.WorkspaceInvitationData[];
        members: UserMembership[];
    };
    permissions: App.Data.WorkspacePermissionsData;
}

export function WorkspaceMemberInvitations({ workspace, permissions }: WorkspaceMemberInvitationsProps) {
    return (
        <ActionSection
            description="These people have been invited to your workspace and have been sent an invitation email. They may join the workspace by accepting the email invitation."
            title="Pending workspace invitations"
        >
            <Table bleed>
                <TableHead>
                    <TableRow>
                        <TableHeader>Email address</TableHeader>
                        {permissions.canRemoveWorkspaceMembers ? (
                            <TableHeader className="relative w-0">
                                <span className="sr-only">Actions</span>
                            </TableHeader>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {workspace.invitations.length > 0 ? (
                        workspace.invitations?.map((invitation) => (
                            <TableRow key={invitation.id}>
                                <TableCell>{invitation.email}</TableCell>
                                {permissions.canRemoveWorkspaceMembers ? (
                                    <TableCell>
                                        <CancelInvitation invitation={invitation} />
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <div className="flex justify-center py-12">
                                    <p className="text-paragraph-sm text-(--text-sub-600)">
                                        There are no pending invitations.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ActionSection>
    );
}

function CancelInvitation({ invitation }: { invitation: App.Data.WorkspaceInvitationData }) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [isCancelling, setCancelling] = React.useState(false);

    function cancelWorkspaceInvitation(invitation: App.Data.WorkspaceInvitationData) {
        setCancelling(true);

        router.delete(route("workspace-invitations.destroy", [invitation.id]), {
            preserveScroll: true,
            onSuccess: async () => {
                await setAction(null);
            },
        });

        setCancelling(false);
    }

    return (
        <Modal.Root
            onOpenChange={(open) => setAction(open ? getAction("WorkspaceInvitationsDestroy", invitation.id) : null)}
            open={action === getAction("WorkspaceInvitationsDestroy", invitation.id)}
        >
            <Modal.Trigger asChild>
                <Button.Root
                    $size="sm"
                    $style="stroke"
                    $type="error"
                    onClick={() => setAction(getAction("WorkspaceInvitationsDestroy", invitation.id))}
                >
                    Cancel invitation
                </Button.Root>
            </Modal.Trigger>

            <Modal.Content className="max-w-[440px]">
                <Modal.Header
                    description="Are you sure you want to cancel this invitation?"
                    icon={MailCloseIcon}
                    title="Cancel invitation"
                />

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={isCancelling}
                            onClick={() => setAction(null)}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        $type="error"
                        className="w-full"
                        disabled={isCancelling}
                        onClick={() => cancelWorkspaceInvitation(invitation)}
                    >
                        {isCancelling ? "Cancelling..." : "Yes, cancel it"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
