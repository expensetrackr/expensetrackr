import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import Logout04Icon from "virtual:icons/hugeicons/logout-04";
import MoreVerticalCircle01Icon from "virtual:icons/hugeicons/more-vertical-circle-01";
import ShieldUserIcon from "virtual:icons/hugeicons/shield-user";
import UserRemove02Icon from "virtual:icons/hugeicons/user-remove-02";

import { useUser } from "#/hooks/use-user.ts";
import { Action, getAction } from "#/utils/action.ts";
import { ActionSection } from "./action-section.tsx";
import { AddWorkspaceMemberForm } from "./forms/add-workspace-member-form.tsx";
import { ManageRoleModal } from "./modals/manage-role-modal.tsx";
import { RemoveWorkspaceMemberModal } from "./modals/remove-workspace-member-modal.tsx";
import * as Avatar from "./ui/avatar.tsx";
import * as Button from "./ui/button.tsx";
import * as Dropdown from "./ui/dropdown.tsx";
import * as Table from "./ui/table.tsx";

interface UserMembership extends App.Data.Auth.UserData {
    membership: {
        role: string;
    };
}

interface WorkspaceMemberManagerProps {
    workspace: App.Data.Workspace.WorkspaceData;
    availableRoles: Array<{ name: string }>;
    permissions: App.Data.Workspace.WorkspacePermissionsData;
}

export function WorkspaceMemberManager({ workspace, availableRoles, permissions }: WorkspaceMemberManagerProps) {
    const [, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const currentUser = useUser();

    const columns: ColumnDef<UserMembership>[] = React.useMemo(
        () => [
            {
                id: "name",
                header: "Member full name",
                accessorKey: "name",
                cell({ cell }) {
                    return (
                        <div className="inline-flex items-center gap-3">
                            <Avatar.Root $size="32" className="size-8">
                                <Avatar.Image
                                    alt={cell.row.original.name}
                                    src={cell.row.original.profilePhotoUrl ?? undefined}
                                />
                            </Avatar.Root>
                            <p className="text-paragraph-sm text-(--text-strong-950)">{cell.row.original.name}</p>
                        </div>
                    );
                },
            },
            {
                id: "email",
                header: "Email address",
                accessorKey: "email",
                cell({ cell }) {
                    return <div className="text-paragraph-sm text-(--text-sub-600)">{cell.row.original.email}</div>;
                },
            },
            {
                id: "role",
                header: "Role",
                accessorKey: "membership.role",
                cell({ cell }) {
                    return (
                        <div className="text-paragraph-sm text-(--text-sub-600)">
                            {cell.row.original.membership.role}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                enableHiding: false,
                header() {
                    return <div className="sr-only">Actions</div>;
                },
                cell({ row }) {
                    if (
                        (permissions.canAddWorkspaceMembers && availableRoles.length > 0) ||
                        permissions.canRemoveWorkspaceMembers ||
                        currentUser.id === row.original.id
                    ) {
                        return (
                            <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                                <Dropdown.Root>
                                    <Dropdown.Trigger aria-label="Actions" asChild>
                                        <Button.Root $size="xs" $style="ghost" $type="neutral">
                                            <Button.Icon as={MoreVerticalCircle01Icon} />
                                        </Button.Root>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        {permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
                                            <Dropdown.Item
                                                onClick={() =>
                                                    setAction(getAction("WorkspaceMembersUpdate", row.original.id))
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
                                                    setAction(getAction("WorkspaceMembersDestroy", row.original.id))
                                                }
                                            >
                                                <Dropdown.ItemIcon as={UserRemove02Icon} />
                                                <Dropdown.Label>Remove member</Dropdown.Label>
                                            </Dropdown.Item>
                                        ) : null}

                                        {currentUser.id === row.original.id ? (
                                            <Dropdown.Item
                                                className="text-state-error-base data-focus:bg-(--color-red-alpha-10) [&>[data-slot=icon]]:text-state-error-base"
                                                onClick={() =>
                                                    setAction(getAction("WorkspaceMembersDestroy", row.original.id))
                                                }
                                            >
                                                <Dropdown.ItemIcon as={Logout04Icon} />
                                                <Dropdown.Label>Leave workspace</Dropdown.Label>
                                            </Dropdown.Item>
                                        ) : null}
                                    </Dropdown.Content>
                                </Dropdown.Root>

                                {permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
                                    <ManageRoleModal
                                        availableRoles={availableRoles}
                                        user={row.original}
                                        workspace={workspace}
                                    />
                                ) : null}

                                {permissions.canRemoveWorkspaceMembers || currentUser.id === row.original.id ? (
                                    <RemoveWorkspaceMemberModal
                                        user={currentUser.id === row.original.id ? currentUser : row.original}
                                        workspace={workspace}
                                        {...(currentUser.id === row.original.id
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
                        );
                    }

                    return null;
                },
                meta: {
                    className: "px-5 w-0",
                },
            },
        ],
        [
            availableRoles,
            currentUser,
            permissions.canAddWorkspaceMembers,
            permissions.canRemoveWorkspaceMembers,
            setAction,
            workspace,
        ],
    );

    const table = useReactTable({
        data: workspace.members,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

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
            <Table.Root className="-mx-4 w-auto px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]">
                <Table.Header className="whitespace-nowrap">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.Head
                                        // @ts-expect-error - className is a custom optional property from meta
                                        className={header.column.columnDef.meta?.className}
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </Table.Head>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Header>

                <Table.Body>
                    {table.getRowModel().rows?.length > 0 ? (
                        table.getRowModel().rows.map((row, i, arr) => (
                            <React.Fragment key={row.id}>
                                <Table.Row data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            // @ts-expect-error - className is a custom optional property from meta
                                            className={cn("h-12", cell.column.columnDef.meta?.className)}
                                            key={cell.id}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                {i < arr.length - 1 && <Table.RowDivider />}
                            </React.Fragment>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={3}>
                                <div className="flex justify-center py-12">
                                    <p className="text-paragraph-sm text-(--text-sub-600)">
                                        There are no members in this workspace yet.
                                    </p>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </ActionSection>
    );
}
