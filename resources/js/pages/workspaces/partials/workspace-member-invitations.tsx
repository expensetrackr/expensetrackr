import { router } from "@inertiajs/react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import MailCloseIcon from "virtual:icons/ri/mail-close-line";

import { ActionSection } from "#/components/action-section.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import * as Table from "#/components/ui/table.tsx";
import { routes } from "#/routes.ts";
import { Action, getAction } from "#/utils/action.ts";

interface WorkspaceMemberInvitationsProps {
    workspace: App.Data.Workspace.WorkspaceData;
    permissions: App.Data.Workspace.WorkspacePermissionsData;
}

export function WorkspaceMemberInvitations({ workspace, permissions }: WorkspaceMemberInvitationsProps) {
    const columns: ColumnDef<App.Data.Workspace.WorkspaceInvitationData>[] = React.useMemo(
        () => [
            {
                id: "email",
                header: "Email address",
                accessorKey: "email",
            },
            ...(permissions.canRemoveWorkspaceMembers
                ? ([
                      {
                          id: "actions",
                          enableHiding: false,
                          header() {
                              return <div className="sr-only">Actions</div>;
                          },
                          cell({ row }) {
                              return <CancelInvitation invitation={row.original} />;
                          },
                          meta: {
                              className: "px-5 w-0",
                          },
                      },
                  ] as ColumnDef<App.Data.Workspace.WorkspaceInvitationData>[])
                : ([] as ColumnDef<App.Data.Workspace.WorkspaceInvitationData>[])),
        ],
        [permissions.canRemoveWorkspaceMembers],
    );

    const table = useReactTable({
        data: workspace.invitations,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <ActionSection
            description="These people have been invited to your workspace and have been sent an invitation email. They may join the workspace by accepting the email invitation."
            title="Pending workspace invitations"
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
                            <Table.Cell colSpan={2}>
                                <div className="flex justify-center py-12">
                                    <p className="text-paragraph-sm text-(--text-sub-600)">
                                        There are no pending invitations.
                                    </p>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            {/* <Table bleed>
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
            </Table> */}
        </ActionSection>
    );
}

function CancelInvitation({ invitation }: { invitation: App.Data.Workspace.WorkspaceInvitationData }) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const [isCancelling, setCancelling] = React.useState(false);

    function cancelWorkspaceInvitation(invitation: App.Data.Workspace.WorkspaceInvitationData) {
        setCancelling(true);

        router.delete(routes.workspaceInvitations.destroy.url({ invitation: invitation.id.toString() }), {
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
