import ArrowRightSIcon from "virtual:icons/ri/arrow-right-s-line";
import { router, useForm, usePage } from "@inertiajs/react";

import { Button } from "#/components/button";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { FormSection } from "#/components/form-section";
import { Input } from "#/components/input";
import { StyledLink } from "#/components/link";
import type { InertiaSharedProps, User, Workspace, WorkspacePermissions } from "#/types";

interface UpdateWorkspaceNameFormProps {
	workspace: Workspace & {
		owner: User;
	};
	permissions: WorkspacePermissions;
}

export function UpdateWorkspaceNameForm({ workspace, permissions }: UpdateWorkspaceNameFormProps) {
	const page = usePage<InertiaSharedProps>();
	const form = useForm({
		name: workspace.name,
	});
	const isEditMode = page.props.ziggy?.query?.edit === "name";

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
			{isEditMode && permissions.canUpdateWorkspace ? (
				<form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
					<Field>
						<Label className="sr-only">Workspace name</Label>
						<Input
							autoComplete="name"
							autoFocus
							invalid={!!form.errors.name}
							name="name"
							type="text"
							onChange={(e) => form.setData("name", e.target.value)}
							placeholder="e.g. Apple"
							value={form.data.name}
						/>
						{form.errors.name && <ErrorMessage>{form.errors.name}</ErrorMessage>}
					</Field>

					<div className="flex items-center justify-end gap-2">
						<Button
							$color="neutral"
							$variant="stroke"
							$size="sm"
							href={route("workspaces.show", [workspace.id])}
							className="px-2"
						>
							Cancel
						</Button>
						<Button $size="sm" className="px-4" type="submit">
							{form.processing ? "Updating..." : "Update"}
						</Button>
					</div>
				</form>
			) : (
				<>
					<p className="text-paragraph-sm">{workspace?.name}</p>

					<StyledLink
						$color="primary"
						className="gap-1 [&>[data-slot=icon]]:sm:size-5"
						href={route("workspaces.show", {
							workspace: workspace.id,
							edit: "name",
						})}
					>
						<span>Edit</span>
						<ArrowRightSIcon />
					</StyledLink>
				</>
			)}
		</FormSection>
	);
}
