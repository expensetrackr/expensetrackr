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
import { Field, Hint, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
import { Action } from "#/utils/action.ts";

export function SetPasswordForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const { data, setData, errors, ...form } = useForm({
        password: "",
        password_confirmation: "",
    });
    const passwordRef = useRef<HTMLInputElement>(null);

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
                <>
                    <Button $color="neutral" $variant="stroke" onClick={() => setAction(Action.UserPasswordCreate)}>
                        Set password
                    </Button>

                    <Dialog onClose={() => setAction(null)} open={action === Action.UserPasswordCreate}>
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
                            <form className="flex flex-col gap-3" id="set-password-form" onSubmit={onSubmit}>
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
                                    {errors.password && <Hint invalid>{errors.password}</Hint>}
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
                                        <Hint invalid>{errors.password_confirmation}</Hint>
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
                                form="set-password-form"
                                type="submit"
                            >
                                {form.processing ? "Saving..." : "Save"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
            description="Create a password for enhanced account security."
            title="Set password"
        />
    );
}
