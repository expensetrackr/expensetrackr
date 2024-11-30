import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useRef } from "react";
import LockPasswordIcon from "virtual:icons/ri/lock-password-line";

import { ActionSection } from "#/components/action-section.tsx";
import { Button } from "#/components/button.tsx";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogDescription,
    DialogHeader,
    DialogIcon,
    DialogTitle,
} from "#/components/dialog.tsx";
import { ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { Action } from "#/utils/action.ts";

export function UpdatePasswordForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const { data, setData, errors, ...form } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.put(route("user-password.update"), {
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
                <>
                    <Button $color="neutral" $variant="stroke" onClick={() => setAction(Action.UserPasswordUpdate)}>
                        Update password
                    </Button>
                    <Dialog onClose={() => setAction(null)} open={action === Action.UserPasswordUpdate}>
                        <DialogHeader>
                            <DialogIcon>
                                <LockPasswordIcon className="size-6 text-(--icon-sub-600)" />
                            </DialogIcon>

                            <div className="flex flex-1 flex-col gap-1">
                                <DialogTitle>Update password</DialogTitle>
                                <DialogDescription>
                                    Update your password to ensure your account remains secure.
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                            <form className="flex flex-col gap-3" id="update-password-form" onSubmit={onSubmit}>
                                <Field>
                                    <Label>Current password</Label>
                                    <Input
                                        autoComplete="current-password"
                                        autoFocus
                                        invalid={!!errors.current_password}
                                        name="current_password"
                                        onChange={(e) => setData("current_password", e.target.value)}
                                        placeholder="Enter your password"
                                        ref={currentPasswordRef}
                                        type="password"
                                    />
                                    {errors.current_password && <ErrorMessage>{errors.current_password}</ErrorMessage>}
                                </Field>
                                <Field>
                                    <Label>New password</Label>
                                    <Input
                                        autoComplete="new-password"
                                        invalid={!!errors.password}
                                        name="password"
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="8+ characters long, 1 capital letter"
                                        ref={passwordRef}
                                        type="password"
                                    />
                                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                                </Field>
                                <Field>
                                    <Label>Confirm password</Label>
                                    <Input
                                        autoComplete="new-password"
                                        invalid={!!errors.password_confirmation}
                                        name="password"
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        placeholder="Confirm your password"
                                        type="password"
                                    />
                                    {errors.password_confirmation && (
                                        <ErrorMessage>{errors.password_confirmation}</ErrorMessage>
                                    )}
                                </Field>
                            </form>
                        </DialogBody>

                        <DialogActions>
                            <Button
                                $color="neutral"
                                $size="sm"
                                $variant="stroke"
                                className="w-full"
                                disabled={form.processing}
                                onClick={() => setAction(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                $size="sm"
                                className="w-full"
                                disabled={form.processing}
                                form="update-password-form"
                                type="submit"
                            >
                                {form.processing ? "Updating..." : "Update"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
            description="Update password for enhanced account security."
            title="Update password"
        />
    );
}
