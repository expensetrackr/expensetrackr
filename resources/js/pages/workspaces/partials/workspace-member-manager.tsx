import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import EraserIcon from "virtual:icons/ri/eraser-line";
import FolderShield2Icon from "virtual:icons/ri/folder-shield-2-line";
import LogoutCircleRIcon from "virtual:icons/ri/logout-circle-r-line";
import More2Icon from "virtual:icons/ri/more-2-line";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import UserMinusIcon from "virtual:icons/ri/user-minus-line";
import { route } from "ziggy-js";

import { ActionSection } from "#/components/action-section.tsx";
import { Select } from "#/components/form/select.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table.tsx";
import * as Avatar from "#/components/ui/avatar.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Dropdown from "#/components/ui/dropdown.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { useUser } from "#/hooks/use-user.ts";
import { Action, getAction } from "#/utils/action.ts";
import { AddWorkspaceMemberForm } from "./add-workspace-member-form.tsx";

interface UserMembership extends App.Data.Auth.UserData {
    membership: {
        role: string;
    };
}

interface WorkspaceMemberManagerProps {
    workspace: App.Data.Workspace.WorkspaceData & {
        owner: App.Data.Auth.UserData;
        invitations: App.Data.Workspace.WorkspaceInvitationData[];
        members: UserMembership[];
    };
    availableRoles: Array<{ name: string }>;
    permissions: App.Data.Workspace.WorkspacePermissionsData;
}

export function WorkspaceMemberManager({ workspace, availableRoles, permissions }: WorkspaceMemberManagerProps) {
    const [, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const currentUser = useUser();

    return (
        <ActionSection
            action={
                permissions.canAddWorkspaceMembers ? (
                    <AddWorkspaceMemberForm availableRoles={availableRoles} workspace={workspace} />
                ) : null
            }
            description="All of the people that are part of this workspace."
            title="Members"
        >
            <Table bleed>
                <TableHead>
                    <TableRow>
                        <TableHeader>Member full name</TableHeader>
                        <TableHeader>Email address</TableHeader>
                        <TableHeader>Role</TableHeader>
                        <TableHeader className="relative w-0">
                            <span className="sr-only">Actions</span>
                        </TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {workspace.members.length > 0 ? (
                        workspace.members?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="inline-flex items-center gap-3">
                                        <Avatar.Root $size="32" className="size-8">
                                            <Avatar.Image alt={user.name} src={user.profilePhotoUrl ?? undefined} />
                                        </Avatar.Root>
                                        <p className="text-(--text-strong-950)">{user.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.membership.role}</TableCell>

                                {(permissions.canAddWorkspaceMembers && availableRoles.length > 0) ||
                                permissions.canRemoveWorkspaceMembers ||
                                currentUser.id === user.id ? (
                                    <TableCell>
                                        <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                                            <Dropdown.Root>
                                                <Dropdown.Trigger aria-label="Actions" asChild>
                                                    <Button.Root $size="xs" $style="ghost" $type="neutral">
                                                        <Button.Icon as={More2Icon} />
                                                    </Button.Root>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    {permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                setAction(getAction("WorkspaceMembersUpdate", user.id))
                                                            }
                                                        >
                                                            <Dropdown.ItemIcon as={ShieldUserIcon} />
                                                            <Dropdown.Label>Update role</Dropdown.Label>
                                                        </Dropdown.Item>
                                                    ) : null}

                                                    {permissions.canRemoveWorkspaceMembers ? (
                                                        <Dropdown.Item
                                                            className="text-state-error-base data-focus:bg-(--color-red-alpha-10) [&>[data-slot=icon]]:text-state-error-base"
                                                            onClick={() =>
                                                                setAction(getAction("WorkspaceMembersDestroy", user.id))
                                                            }
                                                        >
                                                            <Dropdown.ItemIcon as={UserMinusIcon} />
                                                            <Dropdown.Label>Remove member</Dropdown.Label>
                                                        </Dropdown.Item>
                                                    ) : null}

                                                    {currentUser.id === user.id ? (
                                                        <Dropdown.Item
                                                            className="text-state-error-base data-focus:bg-(--color-red-alpha-10) [&>[data-slot=icon]]:text-state-error-base"
                                                            onClick={() =>
                                                                setAction(getAction("WorkspaceMembersDestroy", user.id))
                                                            }
                                                        >
                                                            <Dropdown.ItemIcon as={LogoutCircleRIcon} />
                                                            <Dropdown.Label>Leave workspace</Dropdown.Label>
                                                        </Dropdown.Item>
                                                    ) : null}
                                                </Dropdown.Content>
                                            </Dropdown.Root>

                                            {permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
                                                <ManageRoleDialog
                                                    availableRoles={availableRoles}
                                                    user={user}
                                                    workspace={workspace}
                                                />
                                            ) : null}

                                            {permissions.canRemoveWorkspaceMembers || currentUser.id === user.id ? (
                                                <RemoveMemberDialog
                                                    user={currentUser.id === user.id ? currentUser : user}
                                                    workspace={workspace}
                                                    {...(currentUser.id === user.id
                                                        ? {
                                                              dialogTitle: "Leave workspace",
                                                              dialogDescription:
                                                                  "Are you sure you would like to leave this workspace?",
                                                              dialogSubmitLabel: "Yes, leave it",
                                                          }
                                                        : {})}
                                                />
                                            ) : null}
                                        </div>
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <div className="flex justify-center py-12">
                                    <p className="text-paragraph-sm text-(--text-sub-600)">
                                        There are no members in this workspace yet.
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

function ManageRoleDialog({
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

        form.put(route("workspace-members.update", [workspace.id, user.id]), {
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
                    icon={FolderShield2Icon}
                    title="Manage role"
                />

                <Modal.Body>
                    <form id={`update-workspace-members-role-${user.id}-form`} onSubmit={onSubmit}>
                        {availableRoles.length > 0 ? (
                            <Select
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
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => setAction(null)}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        className="w-full"
                        disabled={form.processing}
                        form={`manage-role-form-${user.id}`}
                        type="submit"
                    >
                        {form.processing ? "Updating..." : "Update role"}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}

function RemoveMemberDialog({
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

        form.delete(route("workspace-members.destroy", [workspace.id, user.id]), {
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
                <Modal.Header description={dialogDescription} icon={EraserIcon} title={dialogTitle} />

                <Modal.Body>
                    <form className="sr-only" id={`destroy-workspace-members-${user.id}-form`} onSubmit={onSubmit} />
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            $size="sm"
                            $style="stroke"
                            $type="neutral"
                            className="w-full"
                            disabled={form.processing}
                            onClick={() => setAction(null)}
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        $size="sm"
                        className="w-full"
                        disabled={form.processing}
                        form={`destroy-workspace-members-${user.id}-form`}
                        type="submit"
                    >
                        {form.processing ? "Removing..." : dialogSubmitLabel}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
