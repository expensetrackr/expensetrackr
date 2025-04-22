import { useForm } from "@inertiajs/react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import Logout01Icon from "virtual:icons/hugeicons/logout-01";
import ChromeIcon from "virtual:icons/logos/chrome";
import FirefoxIcon from "virtual:icons/logos/firefox";

import { ActionSection } from "#/components/action-section.tsx";
import * as Button from "#/components/ui/button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import * as Table from "#/components/ui/table.tsx";
import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";
import { cn } from "#/utils/cn.ts";

const columns: ColumnDef<App.Data.Auth.SessionData>[] = [
    {
        id: "browser",
        header: "Browser",
        accessorFn: (row) => row.device.browser,
        cell({ cell }) {
            return (
                <p className="inline-flex items-center gap-3">
                    <span className="inline-flex rounded-full bg-(--state-faded-lighter) p-1.5">
                        {cell.row.original.device.browser === "Firefox" ? (
                            <FirefoxIcon className="size-5 text-(--text-sub-600)" />
                        ) : null}
                        {cell.row.original.device.browser === "Chrome" ? (
                            <ChromeIcon className="size-5 text-(--text-sub-600)" />
                        ) : null}
                    </span>
                    <span className="text-paragraph-sm">{cell.row.original.device.browser}</span>
                </p>
            );
        },
    },
    {
        id: "lastActive",
        header: "Most recent activity",
        accessorKey: "lastActive",
        cell({ cell }) {
            return (
                <div className="text-paragraph-sm text-(--text-sub-600)">
                    {cell.row.original.isCurrentDevice ? "current.session" : cell.row.original.lastActive}
                </div>
            );
        },
    },
    {
        id: "ipAddress",
        header: "IP Address",
        accessorKey: "ipAddress",
        cell({ cell }) {
            return <div className="text-paragraph-sm text-(--text-sub-600)">{cell.row.original.ipAddress}</div>;
        },
    },
];
interface LogoutOtherBrowserSessionsFormProps {
    sessions: App.Data.Auth.SessionData[];
}

export function LogoutOtherBrowserSessionsForm({ sessions }: LogoutOtherBrowserSessionsFormProps) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        password: "",
    });
    const passwordRef = React.useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.delete(routes.otherBrowserSessions.destroy.url(), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordRef.current?.focus(),
            onFinish: () => form.reset(),
        });
    }

    async function closeModal() {
        await setAction(null);

        form.reset();
    }

    const table = useReactTable({
        data: sessions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <ActionSection
            action={
                <Modal.Root
                    onOpenChange={(open) => setAction(open ? Action.OtherBrowserSessionsDestroy : null)}
                    open={action === Action.OtherBrowserSessionsDestroy}
                >
                    <Modal.Trigger asChild>
                        <Button.Root
                            $style="stroke"
                            $type="error"
                            onClick={() => setAction(Action.OtherBrowserSessionsDestroy)}
                        >
                            Log out all sessions
                        </Button.Root>
                    </Modal.Trigger>

                    <Modal.Content className="max-w-[440px]">
                        <Modal.Header
                            description="Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices."
                            icon={Logout01Icon}
                            title="Log out other browser sessions"
                        />

                        <Modal.Body>
                            <form
                                {...routes.otherBrowserSessions.destroy.form()}
                                className="flex flex-col gap-3"
                                id="logout-other-browser-sessions-form"
                                onSubmit={onSubmit}
                            >
                                <TextField
                                    $error={!!form.errors.password}
                                    autoComplete="current-password"
                                    autoFocus
                                    disabled={form.processing}
                                    hint={form.errors.password}
                                    label="Password"
                                    name="password"
                                    onChange={(e) => form.setData("password", e.target.value)}
                                    placeholder="Enter your password"
                                    type="password"
                                    value={form.data.password}
                                />
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
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button.Root>
                            </Modal.Close>
                            <Button.Root
                                $size="sm"
                                $type="error"
                                className="w-full"
                                disabled={form.processing}
                                form="logout-other-browser-sessions-form"
                                type="submit"
                            >
                                {form.processing ? "Logging out..." : "Yes, log me out"}
                            </Button.Root>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            }
            description="Manage and log out your active sessions on other browsers and devices."
            title="Browser sessions"
        >
            {sessions.length ? (
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
                        {table.getRowModel().rows?.length > 0 &&
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
                            ))}
                    </Table.Body>
                </Table.Root>
            ) : null}
        </ActionSection>
    );
}
