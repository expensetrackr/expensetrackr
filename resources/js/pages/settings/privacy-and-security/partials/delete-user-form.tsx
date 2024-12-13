import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useRef } from "react";
import DeleteBinIcon from "virtual:icons/ri/delete-bin-line";

import { ActionSection } from "#/components/action-section.tsx";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogDescription,
    DialogHeader,
    DialogIcon,
    DialogTitle,
} from "#/components/dialog.tsx";
import { TextField } from "#/components/form/text-field.tsx";
import * as Button from "#/components/ui/button.tsx";
import { Action } from "#/utils/action.ts";

export function DeleteUserForm() {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        password: "",
    });
    const passwordRef = useRef<HTMLInputElement>(null);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.delete(route("current-user.destroy"), {
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
                <>
                    <Button.Root $style="stroke" $type="error" onClick={() => setAction(Action.CurrentUserDestroy)}>
                        Delete account
                    </Button.Root>

                    <Dialog onClose={() => setAction(null)} open={action === Action.CurrentUserDestroy}>
                        <DialogHeader>
                            <DialogIcon>
                                <DeleteBinIcon className="size-6 text-(--icon-sub-600)" />
                            </DialogIcon>

                            <div className="flex flex-1 flex-col gap-1">
                                <DialogTitle>Delete account</DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its resources and data will be permanently
                                    deleted.
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <DialogBody>
                            <form className="flex flex-col gap-3" id="delete-user-form" onSubmit={onSubmit}>
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
                        </DialogBody>

                        <DialogActions>
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
                            <Button.Root
                                $size="sm"
                                $type="error"
                                className="w-full"
                                disabled={form.processing}
                                form="delete-user-form"
                                type="submit"
                            >
                                {form.processing ? "Deleting..." : "Yes, delete my account"}
                            </Button.Root>
                        </DialogActions>
                    </Dialog>
                </>
            }
            description="Permanently delete your account."
            title="Delete account"
        />
    );
}
