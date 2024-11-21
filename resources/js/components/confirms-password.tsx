import { useForm } from "@inertiajs/react";
import axios from "axios";
import { useQueryState } from "nuqs";
import { useRef } from "react";
import LockPasswordIcon from "virtual:icons/ri/lock-password-line";

import { Button } from "./button.tsx";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogDescription,
    DialogHeader,
    DialogIcon,
    DialogTitle,
} from "./dialog.tsx";
import { ErrorMessage, Field, Label } from "./form/fieldset.tsx";
import { Input } from "./form/input.tsx";

interface ConfirmsPasswordProps {
    onConfirm?: () => void;
    children: React.ReactNode;
}

export function ConfirmsPassword({ onConfirm, children }: ConfirmsPasswordProps) {
    const [action, setAction] = useQueryState("action");
    const { data, setData, errors, ...form } = useForm({
        password: "",
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    async function startConfirmingPassword() {
        return axios.get(route("password.confirmation")).then(async (response) => {
            if (response.data.confirmed) {
                onConfirm?.();
            } else {
                await setAction("confirming:password");
            }
        });
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post(route("password.confirm"), {
            errorBag: "password",
            preserveScroll: true,
            async onSuccess() {
                await setAction(null);
                form.reset();
                setTimeout(() => onConfirm?.(), 250);
            },
            onError: () => {
                if (errors.password) {
                    form.reset("password");
                    passwordRef.current?.focus();
                }
            },
        });
    }

    return (
        <>
            <span onClick={startConfirmingPassword} onKeyDown={(e) => e.key === "Enter" && startConfirmingPassword()}>
                {children}
            </span>

            <Dialog onClose={() => setAction(null)} open={action === "confirming:password"}>
                <DialogHeader>
                    <DialogIcon>
                        <LockPasswordIcon className="size-6 text-(--icon-sub-600)" />
                    </DialogIcon>

                    <div className="flex flex-1 flex-col gap-1">
                        <DialogTitle>Confirm Password</DialogTitle>
                        <DialogDescription>
                            For your security, please confirm your password to continue.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogBody>
                    <form className="flex flex-col gap-3" id="set-password-form" onSubmit={onSubmit}>
                        <Field>
                            <Label>Password</Label>
                            <Input
                                autoComplete="current-password"
                                autoFocus
                                invalid={!!errors.password}
                                name="password"
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Enter your password"
                                ref={passwordRef}
                                type="password"
                            />
                            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
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
                        {form.processing ? "Confirming..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
