import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";
import LockPasswordIcon from "virtual:icons/ri/lock-password-line";

import { ActionSection } from "#/components/action-section.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import * as Button from "#/components/ui/button.tsx";
import * as Modal from "#/components/ui/modal.tsx";
import { Action } from "#/utils/action.ts";

export function SetPasswordForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const { data, setData, errors, ...form } = useForm({
        password: "",
        password_confirmation: "",
    });
    const passwordRef = React.useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post(route("user-password.set"), {
            errorBag: "setPassword",
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setTimeout(() => setAction(null), 100);
            },
            onError: () => {
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
                    onOpenChange={(open) => setAction(open ? Action.UserPasswordCreate : null)}
                    open={action === Action.UserPasswordCreate}
                >
                    <Modal.Trigger asChild>
                        <Button.Root
                            $style="stroke"
                            $type="neutral"
                            onClick={() => setAction(Action.UserPasswordCreate)}
                        >
                            Set password
                        </Button.Root>
                    </Modal.Trigger>

                    <Modal.Content className="max-w-[440px]">
                        <Modal.Header
                            description="Create a password for enhanced account security."
                            icon={LockPasswordIcon}
                            title="Set password"
                        />

                        <Modal.Body>
                            <form className="flex flex-col gap-3" id="set-password-form" onSubmit={onSubmit}>
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
                                    hint={errors.password_confirmation}
                                    label="Confirm password"
                                    name="password_confirmation"
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
                                form="set-password-form"
                                type="submit"
                            >
                                {form.processing ? "Saving..." : "Save"}
                            </Button.Root>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal.Root>
            }
            description="Create a password for enhanced account security."
            title="Set password"
        />
    );
}
