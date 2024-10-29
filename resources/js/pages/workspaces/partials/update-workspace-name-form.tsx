import { router, useForm } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { route } from "ziggy-js";

import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import type { User, Workspace, WorkspacePermissions } from "#/types";

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
	const debouncedName = useDebounce(form.data.name, 500);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to update the workspace name when the debounced name changes
	useEffect(() => {
		if (!permissions.canUpdateWorkspace || workspace.name === debouncedName) return;

		form.put(route("workspaces.update", [workspace.id]), {
			errorBag: "updateTeamName",
			preserveScroll: true,
			onSuccess: () => router.visit(route("workspaces.show", [workspace.id])),
		});
	}, [debouncedName, workspace.name]);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!permissions.canUpdateWorkspace) return;

		form.put(route("workspaces.update", [workspace.id]), {
			errorBag: "updateTeamName",
			preserveScroll: true,
			onSuccess: () => router.visit(route("workspaces.show", [workspace.id])),
		});
	}

	return (
		<FormSection title="Name" description="Your workspace name is how others will recognize you on the platform.">
			<form id="update-workspace-name-form" onSubmit={onSubmit} className="w-full">
				<Field>
					<Label className="sr-only">Workspace name</Label>
					<Input
						autoComplete="name"
						invalid={!!form.errors.name}
						name="name"
						type="text"
						onChange={(e) => form.setData("name", e.target.value)}
						placeholder="e.g. Apple"
						value={form.data.name}
						readOnly={!permissions.canUpdateWorkspace}
						disabled={form.processing}
					/>
					{form.errors.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
				</Field>
			</form>
		</FormSection>
	);
}
