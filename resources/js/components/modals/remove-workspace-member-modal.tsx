import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import Delete02SolidIcon from "virtual:icons/hugeicons/delete-02-solid";

import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";
import { Button } from "../button.tsx";
import { SubmitButton } from "../submit-button.tsx";
import * as Modal from "../ui/modal.tsx";

type UserMembership = App.Data.Auth.UserData & {
    membership: {
        role: string;
    };
};

export function RemoveWorkspaceMemberModal({
    workspace,
    user,
    dialogTitle = "Remove workspace member",
    dialogDescription = "Are you sure you would like to remove this person from the workspace?",
    dialogSubmitLabel = "Yes, remove it",
}: {
    workspace: App.Data.Workspace.WorkspaceData;
    user: UserMembership | App.Data.Auth.UserData;
    dialogTitle?: string;
    dialogDescription?: string;
    dialogSubmitLabel?: string;
}) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({});

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.delete(routes.workspaceMembers.destroy.url({ workspace: workspace.id, user: user.id }), {
            errorBag: "removeWorkspaceMember",
            preserveScroll: true,
            preserveState: true,
            onSuccess: async () => {
                form.reset();
                await setAction(null);
            },
        });
    }

    return (
        <Modal.Root
            onOpenChange={() => setAction(null)}
            open={action === Action.WorkspaceMembersDestroy.replace("{id}", user.id.toString())}
        >
            <Modal.Content className="max-w-[440px]">
                <Modal.Header description={dialogDescription} icon={Delete02SolidIcon} title={dialogTitle} />

                <Modal.Body>
                    <form
                        {...routes.workspaceMembers.destroy.form({ workspace: workspace.id, user: user.id })}
                        className="sr-only"
                        id={`destroy-workspace-members-${user.id}-form`}
                        onSubmit={onSubmit}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => setAction(null)}
                        >
                            Cancel
                        </Button>
                    </Modal.Close>
                    <SubmitButton
                        $size="sm"
                        className="w-full"
                        form={`destroy-workspace-members-${user.id}-form`}
                        isSubmitting={form.processing}
                    >
                        {form.processing ? "Removing..." : dialogSubmitLabel}
                    </SubmitButton>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
