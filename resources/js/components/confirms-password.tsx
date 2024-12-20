import { useForm } from "@inertiajs/react";
import axios from "axios";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useRef } from "react";
import LockPasswordIcon from "virtual:icons/ri/lock-password-line";

import { Action } from "#/utils/action.ts";
import { TextField } from "./text-field.tsx";
import * as Button from "./ui/button.tsx";
import * as Modal from "./ui/modal.tsx";

interface ConfirmsPasswordProps {
    onConfirm?: () => void;
    children: React.ReactNode;
}

export function ConfirmsPassword({ onConfirm, children }: ConfirmsPasswordProps) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const { data, setData, errors, ...form } = useForm({
        password: "",
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    async function startConfirmingPassword() {
        return axios.get(route("password.confirmation")).then(async (response) => {
            if (response.data.confirmed) {
                onConfirm?.();
            } else {
                await setAction(Action.PasswordConfirm);
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

            <Modal.Root
                onOpenChange={(open) => setAction(open ? Action.PasswordConfirm : null)}
                open={action === Action.PasswordConfirm}
            >
                <Modal.Content className="max-w-[440px]">
                    <Modal.Header
                        description="For your security, please confirm your password to continue."
                        icon={LockPasswordIcon}
                        title="Confirm Password"
                    />

                    <Modal.Body>
                        <form className="flex flex-col gap-3" id="set-password-form" onSubmit={onSubmit}>
                            <TextField
                                $error={!!errors.password}
                                autoComplete="current-password"
                                autoFocus
                                hint={errors.password}
                                label="Password"
                                name="password"
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Enter your password"
                                ref={passwordRef}
                                type="password"
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
                            {form.processing ? "Confirming..." : "Confirm"}
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}
