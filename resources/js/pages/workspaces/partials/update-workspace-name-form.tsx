import { useForm } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { TextField } from "#/components/form/text-field.tsx";
import { FormSection } from "#/components/form-section.tsx";
import { type User, type Workspace, type WorkspacePermissions } from "#/types/index.ts";

interface UpdateWorkspaceNameFormProps {
    workspace: Workspace & {
        owner: User;
    };
    permissions: WorkspacePermissions;
}

export function UpdateWorkspaceNameForm({ workspace, permissions }: UpdateWorkspaceNameFormProps) {
    const form = useForm({
        name: workspace.name,
    });
    const debouncedName = useDebounce(form.data.name, 1000);

    const sendRequest = useCallback(() => {
        form.put(route("workspaces.update", [workspace.id]), {
            errorBag: "updateTeamName",
            preserveScroll: true,
            onSuccess: () => {
                toast("Workspace name updated.");
            },
        });
    }, [form, workspace.id]);

    useEffect(() => {
        if (!permissions.canUpdateWorkspace || workspace.name === debouncedName) return;

        sendRequest();
    }, [debouncedName, permissions.canUpdateWorkspace, sendRequest, workspace.name]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!permissions.canUpdateWorkspace) return;

        sendRequest();
    }

    return (
        <FormSection description="Your workspace name is how others will recognize you on the platform." title="Name">
            <form className="w-full" id="update-workspace-name-form" onSubmit={onSubmit}>
                <TextField
                    $error={!!form.errors.name}
                    autoComplete="organization"
                    autoFocus
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
