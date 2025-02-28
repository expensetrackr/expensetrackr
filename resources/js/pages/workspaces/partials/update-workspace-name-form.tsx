import { useForm } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import * as React from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { TextField } from "#/components/form/text-field.tsx";
import { FormSection } from "#/components/form-section.tsx";

interface UpdateWorkspaceNameFormProps {
    workspace: App.Data.WorkspaceData & {
        owner: App.Data.UserData;
    };
    permissions: App.Data.WorkspacePermissionsData;
}

export function UpdateWorkspaceNameForm({ workspace, permissions }: UpdateWorkspaceNameFormProps) {
    const form = useForm({
        name: workspace.name,
    });
    const debouncedName = useDebounce(form.data.name, 1000);

    const sendRequest = React.useCallback(() => {
        form.put(route("workspaces.update", [workspace.id]), {
            errorBag: "updateTeamName",
            preserveScroll: true,
            onSuccess: () => {
                toast("Workspace name updated.");
            },
        });
    }, [form, workspace.id]);

    React.useEffect(() => {
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
