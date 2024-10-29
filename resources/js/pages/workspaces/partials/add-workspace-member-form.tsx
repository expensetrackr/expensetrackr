import TeamIcon from "virtual:icons/ri/team-line";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

import { Button } from "#/components/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogHeader,
	DialogIcon,
	DialogTitle,
} from "#/components/dialog";
import { ErrorMessage, Field, Label } from "#/components/fieldset";
import { Input } from "#/components/input";
import { Select } from "#/components/select.tsx";
import type { Nullable, Role, Workspace } from "#/types";

interface AddWorkspaceMemberFormProps {
	workspace: Workspace;
	availableRoles: Role[];
}

export function AddWorkspaceMemberForm({ workspace, availableRoles }: AddWorkspaceMemberFormProps) {
	const [isOpen, setOpen] = useState(false);
	const form = useForm({
		email: "",
		role: null as Nullable<string>,
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.post(route("workspace-members.store", [workspace.id]), {
			errorBag: "addWorkspaceMember",
			preserveScroll: true,
			onSuccess: () => form.reset(),
		});
	}

	return (
		<>
			<Button $size="sm" className="px-4" onClick={() => setOpen(true)}>
				Add workspace member
			</Button>

			<Dialog open={isOpen} onClose={setOpen}>
				<DialogHeader>
					<DialogIcon>
						<TeamIcon className="size-6 text-[var(--icon-sub-600)]" />
					</DialogIcon>

					<div className="flex flex-1 flex-col gap-1">
						<DialogTitle>Add workspace member</DialogTitle>
						<DialogDescription>
							Add a new team member to your team, allowing them to collaborate with you.
						</DialogDescription>
					</div>
				</DialogHeader>

				<DialogBody>
					<form onSubmit={onSubmit} id="add-workspace-member-form" className="flex flex-col gap-3">
						<Field>
							<Label>Email address</Label>
							<Input
								autoComplete="off"
								autoFocus
								invalid={!!form.errors.email}
								name="email"
								type="email"
								onChange={(e) => form.setData("email", e.target.value)}
								placeholder="i.e. john@example.com"
							/>
							{form.errors.email && <ErrorMessage>{form.errors.email}</ErrorMessage>}
						</Field>

						{availableRoles.length > 0 ? (
							<Field>
								<Label>Role</Label>
								<Select name="role" invalid={!!form.errors.role} onChange={(e) => form.setData("role", e.target.value)}>
									{availableRoles.map((role) => (
										<option key={role.key} value={role.key}>
											{role.name}
										</option>
									))}
								</Select>

								{form.errors.role && <ErrorMessage>{form.errors.role}</ErrorMessage>}
							</Field>
						) : null}
					</form>
				</DialogBody>

				<DialogActions>
					<Button
						$color="neutral"
						$variant="stroke"
						$size="sm"
						disabled={form.processing}
						className="w-full"
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button
						$size="sm"
						disabled={form.processing}
						form="add-workspace-member-form"
						type="submit"
						className="w-full"
					>
						{form.processing ? "Sending..." : "Send invitation"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
