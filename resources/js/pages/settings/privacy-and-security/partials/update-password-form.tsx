import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import LockPasswordIcon from "virtual:icons/ri/lock-password-line";

import { ActionSection } from "#/components/action-section.tsx";
import * as Button from "#/components/ui/button.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { routes } from "#/routes.ts";
import { Action } from "#/utils/action.ts";

export function UpdatePasswordForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const { data, setData, errors, ...form } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const currentPasswordRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.put(routes.userPassword.update.url(), {
            errorBag: "updatePassword",
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setTimeout(() => setAction(null), 100);
            },
            onError: () => {
                if (errors.current_password) {
                    form.reset("current_password");
                    currentPasswordRef.current?.focus();
                }

                if (errors.password) {
                    form.reset("password", "password_confirmation");
                    passwordRef.current?.focus();
                }
            },
        });
    }

    return (
        <ActionSection
            action={
                <Modal.Root
                    onOpenChange={(open) => setAction(open ? Action.UserPasswordUpdate : null)}
                    open={action === Action.UserPasswordUpdate}
                >
                    <Modal.Trigger asChild>
                        <Button.Root
                            $style="stroke"
                            $type="neutral"
                            onClick={() => setAction(Action.UserPasswordUpdate)}
                        >
                            Update password
                        </Button.Root>
                    </Modal.Trigger>

                    <Modal.Content>
                        <Modal.Header
                            description="Update your password to ensure your account remains secure."
                            icon={LockPasswordIcon}
                            title="Update password"
                        />

                        <Modal.Body>
                            <form
                                {...routes.userPassword.update.form()}
                                className="flex flex-col gap-3"
                                id="update-password-form"
                                onSubmit={onSubmit}
                            >
                                <TextField
                                    $error={!!errors.current_password}
                                    autoComplete="current-password"
                                    autoFocus
                                    hint={errors.current_password}
                                    label="Current password"
                                    name="current_password"
                                    onChange={(e) => setData("current_password", e.target.value)}
                                    placeholder="Enter your password"
                                    type="password"
                                    value={data.current_password}
                                />

                                <TextField
                                    $error={!!errors.password}
                                    autoComplete="new-password"
                                    autoFocus
                                    hint={errors.password}
                                    label="New password"
                                    name="password"
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="8+ characters long, 1 capital letter"
                                    type="password"
                                    value={data.password}
                                />

                                <TextField
                                    $error={!!errors.password_confirmation}
                                    autoComplete="new-password"
                                    autoFocus
                                    hint={errors.password_confirmation}
                                    label="Confirm password"
                                    name="password"
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    placeholder="Confirm your password"
                                    type="password"
                                    value={data.password_confirmation}
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
                                    onClick={() => setAction(null)}
                                >
                                    Cancel
                                </Button.Root>
                            </Modal.Close>
                            <Button.Root
                                $size="sm"
                                className="w-full"
                                disabled={form.processing}
                                form="update-password-form"
                                type="submit"
                            >
                                {form.processing ? "Updating..." : "Update"}
                            </Button.Root>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            }
            description="Update password for enhanced account security."
            title="Update password"
        />
    );
}
