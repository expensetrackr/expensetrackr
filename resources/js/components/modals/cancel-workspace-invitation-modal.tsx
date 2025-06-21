import { router } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import MailRemove01Icon from "virtual:icons/hugeicons/mail-remove-01";

import { routes } from "#/routes.ts";
import { Action, getAction } from "#/utils/action.ts";
import { Button } from "../button.tsx";
import { SubmitButton } from "../submit-button.tsx";
import * as Modal from "../ui/modal.tsx";

export function CancelWorkspaceInvitation({ invitation }: { invitation: App.Data.Workspace.WorkspaceInvitationData }) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [isCancelling, setCancelling] = React.useState(false);

    function cancelWorkspaceInvitation(invitation: App.Data.Workspace.WorkspaceInvitationData) {
        setCancelling(true);

        router.delete(routes.workspaceInvitations.destroy.url({ invitation: invitation.id }), {
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
                <Button
                    $size="sm"
                    $style="stroke"
                    $type="error"
                    onClick={() => setAction(getAction("WorkspaceInvitationsDestroy", invitation.id))}
                >
                    Cancel invitation
                </Button>
            </Modal.Trigger>

            <Modal.Content className="max-w-[440px]">
                <Modal.Header
                    description="Are you sure you want to cancel this invitation?"
                    icon={MailRemove01Icon}
                    title="Cancel invitation"
                />

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={isCancelling}
                            onClick={() => setAction(null)}
                        >
                            Cancel
                        </Button>
                    </Modal.Close>
                    <SubmitButton
                        $size="sm"
                        $type="error"
                        className="w-full"
                        isSubmitting={isCancelling}
                        onClick={() => cancelWorkspaceInvitation(invitation)}
                    >
                        {isCancelling ? "Cancelling..." : "Yes, cancel it"}
                    </SubmitButton>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
