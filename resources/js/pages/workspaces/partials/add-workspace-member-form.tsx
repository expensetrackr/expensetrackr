import { useForm } from "@inertiajs/react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import TeamIcon from "virtual:icons/ri/team-line";
import { route } from "ziggy-js";

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
import { Input } from "#/components/form/old-input.tsx";
import { Select } from "#/components/form/select.tsx";
import { type Role, type Workspace } from "#/types/index.ts";
import { Action } from "#/utils/action.ts";

interface AddWorkspaceMemberFormProps {
    workspace: Workspace;
    availableRoles: Role[];
}

export function AddWorkspaceMemberForm({ workspace, availableRoles }: AddWorkspaceMemberFormProps) {
    const [action, setAction] = useQueryState("action", parseAsStringEnum<Action>(Object.values(Action)));
    const form = useForm({
        email: "",
        role: availableRoles[0]?.key,
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        form.post(route("workspace-members.store", [workspace.id]), {
            errorBag: "addWorkspaceMember",
            preserveScroll: true,
            onSuccess: async () => {
                form.reset();
                await setAction(null);
            },
        });
    }

    return (
        <>
            <Button $size="sm" className="px-4" onClick={() => setAction(Action.WorkspaceMembersCreate)}>
                Add workspace member
            </Button>

            <Dialog onClose={() => setAction(null)} open={action === Action.WorkspaceMembersCreate}>
                <DialogHeader>
                    <DialogIcon>
                        <TeamIcon className="size-6 text-(--icon-sub-600)" />
                    </DialogIcon>

                    <div className="flex flex-1 flex-col gap-1">
                        <DialogTitle>Add workspace member</DialogTitle>
                        <DialogDescription>
                            Add a new team member to your team, allowing them to collaborate with you.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogBody>
                    <form className="flex flex-col gap-3" id="add-workspace-member-form" onSubmit={onSubmit}>
                        <Field>
                            <Label>Email address</Label>
                            <Input
                                autoComplete="off"
                                autoFocus
                                invalid={!!form.errors.email}
                                name="email"
                                onChange={(e) => form.setData("email", e.target.value)}
                                placeholder="i.e. john@example.com"
                                type="email"
                            />
                            {form.errors.email && <Hint invalid>{form.errors.email}</Hint>}
                        </Field>

                        {availableRoles.length > 0 ? (
                            <Field>
                                <Label>Role</Label>
                                <Select
                                    invalid={!!form.errors.role}
                                    name="role"
                                    onChange={(e) => form.setData("role", e.target.value)}
                                    value={form.data.role}
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role.name} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Select>

                                {form.errors.role && <Hint invalid>{form.errors.role}</Hint>}
                            </Field>
                        ) : null}
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
                        form="add-workspace-member-form"
                        type="submit"
                    >
                        {form.processing ? "Sending..." : "Send invitation"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
