import { useForm } from "@inertiajs/react";
import { useQueryState } from "nuqs";
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

export function UpdatePasswordForm() {
    const [action, setAction] = useQueryState("action");
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
            title="Update password"
            description="Update password for enhanced account security."
            action={
                <>
                    <Button
                        $color="neutral"
                        $variant="stroke"
                        className="px-2"
                        onClick={() => setAction("update:user-password")}
                    >
                        Update password
                    </Button>
                    <Dialog open={action === "update:user-password"} onClose={() => setAction(null)}>
                        <DialogHeader>
                            <DialogIcon>
                                <LockPasswordIcon className="size-6 text-[var(--icon-sub-600)]" />
                            </DialogIcon>

                            <div className="flex flex-1 flex-col gap-1">
                                <DialogTitle>Update password</DialogTitle>
                                <DialogDescription>
                                    Update your password to ensure your account remains secure.
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                            <form onSubmit={onSubmit} id="update-password-form" className="flex flex-col gap-3">
                                <Field>
                                    <Label>Current password</Label>
                                    <Input
                                        ref={currentPasswordRef}
                                        autoComplete="current-password"
                                        autoFocus
                                        invalid={!!errors.current_password}
                                        name="current_password"
                                        type="password"
                                        onChange={(e) => setData("current_password", e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    {errors.current_password && <ErrorMessage>{errors.current_password}</ErrorMessage>}
                                </Field>
                                <Field>
                                    <Label>New password</Label>
                                    <Input
                                        ref={passwordRef}
                                        autoComplete="new-password"
                                        invalid={!!errors.password}
                                        name="password"
                                        type="password"
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="8+ characters long, 1 capital letter"
                                    />
                                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                                </Field>
                                <Field>
                                    <Label>Confirm password</Label>
                                    <Input
                                        autoComplete="new-password"
                                        invalid={!!errors.password_confirmation}
                                        name="password"
                                        type="password"
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        placeholder="Confirm your password"
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
                                $variant="stroke"
                                $size="sm"
                                disabled={form.processing}
                                className="w-full"
                                onClick={() => setAction(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                $size="sm"
                                disabled={form.processing}
                                form="update-password-form"
                                type="submit"
                                className="w-full"
                            >
                                {form.processing ? "Updating..." : "Update"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        />
    );
}
