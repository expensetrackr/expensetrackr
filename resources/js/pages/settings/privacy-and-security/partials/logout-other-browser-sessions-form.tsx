import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import ChromeIcon from "virtual:icons/ri/chrome-line";
import FirefoxIcon from "virtual:icons/ri/firefox-line";
import LogoutCircleRIcon from "virtual:icons/ri/logout-circle-r-line";

import { ActionSection } from "#/components/action-section.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { Action } from "#/utils/action.ts";

interface LogoutOtherBrowserSessionsFormProps {
    sessions: Array<{
        ip_address: string;
        is_current_device: boolean;
        device: {
            browser: string;
            desktop: boolean;
            mobile: boolean;
            tablet: boolean;
            platform: string;
        };
        last_active: string;
    }>;
}

export function LogoutOtherBrowserSessionsForm({ sessions }: LogoutOtherBrowserSessionsFormProps) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        password: "",
    });
    const passwordRef = React.useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.delete(route("other-browser-sessions.destroy"), {
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
                            icon={LogoutCircleRIcon}
                            title="Log out other browser sessions"
                        />

                        <Modal.Body>
                            <form
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
                <Table bleed>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Browser</TableHeader>
                            <TableHeader>Most recent activity</TableHeader>
                            <TableHeader>IP Address</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session, index) => (
                            <TableRow key={`${session.device.browser}-${index}`}>
                                <TableCell>
                                    <p className="inline-flex items-center gap-3">
                                        <span className="inline-flex rounded-full bg-(--state-faded-lighter) p-1.5">
                                            {session.device.browser === "Firefox" ? (
                                                <FirefoxIcon className="size-5" />
                                            ) : null}
                                            {session.device.browser === "Chrome" ? (
                                                <ChromeIcon className="size-5" />
                                            ) : null}
                                        </span>
                                        <span>{session.device.browser}</span>
                                    </p>
                                </TableCell>
                                <TableCell>
                                    {session.is_current_device ? "Current Session" : session.last_active}
                                </TableCell>
                                <TableCell>{session.ip_address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : null}
        </ActionSection>
    );
}
