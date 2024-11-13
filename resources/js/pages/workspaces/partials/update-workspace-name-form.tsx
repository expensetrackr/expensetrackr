import { useForm } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";

import { ErrorMessage, Field, Label } from "#/components/form/fieldset.tsx";
import { Input } from "#/components/form/input.tsx";
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
                <Field>
                    <Label className="sr-only">Workspace name</Label>
                    <Input
                        autoComplete="name"
                        disabled={form.processing}
                        invalid={!!form.errors.name}
                        name="name"
                        onChange={(e) => form.setData("name", e.target.value)}
                        placeholder="e.g. Apple"
                        readOnly={!permissions.canUpdateWorkspace}
                        type="text"
                        value={form.data.name}
                    />
                    {form.errors.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
                </Field>
            </form>
        </FormSection>
    );
}
