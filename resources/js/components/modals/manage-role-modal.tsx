import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import FolderSecurityIcon from "virtual:icons/hugeicons/folder-security";

import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";
import { Button } from "../button.tsx";
import { SubmitButton } from "../submit-button.tsx";
import { SelectField } from "../ui/form/select-field.tsx";
import * as Modal from "../ui/modal.tsx";

type UserMembership = App.Data.Auth.UserData & {
    membership: {
        role: string;
    };
};

export function ManageRoleModal({
    workspace,
    user,
    availableRoles,
}: {
    workspace: App.Data.Workspace.WorkspaceData;
    user: UserMembership;
    availableRoles: Array<{ name: string }>;
}) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        role: user.membership.role,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.put(routes.workspaceMembers.update.url({ workspace: workspace.id, user: user.id }), {
            preserveScroll: true,
            onSuccess: async () => {
                form.reset();
                await setAction(null);
            },
        });
    }

    return (
        <Modal.Root
            onOpenChange={() => setAction(null)}
            open={action === Action.WorkspaceMembersUpdate.replace("{id}", user.id.toString())}
        >
            <Modal.Content className="max-w-[440px]">
                <Modal.Header
                    description="Select the new role for this workspace member."
                    icon={FolderSecurityIcon}
                    title="Manage role"
                />

                <Modal.Body>
                    <form
                        {...routes.workspaceMembers.update.form({ workspace: workspace.id, user: user.id })}
                        id={`update-workspace-members-role-${user.id}-form`}
                        onSubmit={onSubmit}
                    >
                        {availableRoles.length > 0 ? (
                            <SelectField
                                error={form.errors.role}
                                id="role"
                                label="Role"
                                name="role"
                                onValueChange={(value) => form.setData("role", value)}
                                options={availableRoles.map((role) => ({
                                    value: role.name,
                                    label: role.name,
                                }))}
                                placeholder="Select a role..."
                                position="item-aligned"
                                value={form.data.role}
                            />
                        ) : null}
                    </form>
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
                        form={`update-workspace-members-role-${user.id}-form`}
                        isSubmitting={form.processing}
                    >
                        {form.processing ? "Updating..." : "Update role"}
                    </SubmitButton>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
