import { useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";

import { FormSection } from "#/components/form-section.tsx";
import { TextField } from "#/components/ui/form/text-field.tsx";
import { routes } from "#/routes.ts";

interface UpdateWorkspaceNameFormProps {
    defaultValues: Pick<App.Data.Workspace.WorkspaceData, "id" | "name">;
    permissions: App.Data.Workspace.WorkspacePermissionsData;
}

export function UpdateWorkspaceNameForm({ defaultValues, permissions }: UpdateWorkspaceNameFormProps) {
    const form = useForm(defaultValues);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!permissions.canUpdateWorkspace) return;

        form.put(routes.workspaces.update.url({ workspace: defaultValues.id }), {
            errorBag: "updateWorkspace",
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Workspace name updated.");
            },
            onError: () => {
                toast.error("Failed to update workspace name.");
            },
        });
    };

    return (
        <FormSection description="Your workspace name is how others will recognize you on the platform." title="Name">
            <form
                {...routes.workspaces.update.form({ workspace: defaultValues.id })}
                className="w-full"
                id="update-workspace-name-form"
                onSubmit={onSubmit}
            >
                <input name="_method" type="hidden" value="PUT" />

                <TextField
                    $error={!!form.errors.name}
                    autoComplete="off"
                    autoFocus
                    data-auto-submit
                    hint={form.errors.name}
                    label="Workspace name"
                    name="name"
                    onChange={(e) => form.setData("name", e.target.value)}
                    placeholder="e.g. Apple"
                    readOnly={!permissions.canUpdateWorkspace}
                    value={form.data.name}
                />
            </form>
        </FormSection>
    );
}
