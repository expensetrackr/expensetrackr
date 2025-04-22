import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { ActionSection } from "./action-section.tsx";
import { CancelWorkspaceInvitation } from "./modals/cancel-workspace-invitation-modal.tsx";
import * as Table from "./ui/table.tsx";

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
                              return <CancelWorkspaceInvitation invitation={row.original} />;
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
        </ActionSection>
    );
}
