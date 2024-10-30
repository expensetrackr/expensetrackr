import EraserIcon from "virtual:icons/ri/eraser-line";
import FolderShield2Icon from "virtual:icons/ri/folder-shield-2-line";
import More2Icon from "virtual:icons/ri/more-2-line";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";
import UserMinusIcon from "virtual:icons/ri/user-minus-line";
import { useForm } from "@inertiajs/react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { route } from "ziggy-js";

import { ActionSection } from "#/components/action-section.tsx";
import { Avatar } from "#/components/avatar.tsx";
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
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from "#/components/dropdown.tsx";
import { ErrorMessage, Field, Label } from "#/components/fieldset.tsx";
import { Select } from "#/components/select.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table.tsx";
import type { Role, User, Workspace, WorkspaceInvitation, WorkspacePermissions } from "#/types/index.d.ts";
import { AddWorkspaceMemberForm } from "./add-workspace-member-form.tsx";

interface UserMembership extends User {
	membership: {
		role: string;
	};
}

interface WorkspaceMemberManagerProps {
	workspace: Workspace & {
		owner: User;
		workspace_invitations: WorkspaceInvitation[];
		users: UserMembership[];
	};
	availableRoles: Role[];
	permissions: WorkspacePermissions;
}

export function WorkspaceMemberManager({ workspace, availableRoles, permissions }: WorkspaceMemberManagerProps) {
	const [edit, setEdit] = useQueryState("edit");
	const [isManagingRole, setManagingRole] = useState(false);
	function displayableRole(role: string) {
		return availableRoles.find((r) => r.key === role)?.name;
	}

	return (
		<ActionSection
			title="Members"
			description="All of the people that are part of this workspace."
			action={
				permissions.canAddWorkspaceMembers ? (
					<AddWorkspaceMemberForm workspace={workspace} availableRoles={availableRoles} />
				) : null
			}
		>
			<Table bleed>
				<TableHead>
					<TableRow>
						<TableHeader>Member full name</TableHeader>
						<TableHeader>Email address</TableHeader>
						<TableHeader>Role</TableHeader>
						{(permissions.canAddWorkspaceMembers && availableRoles.length > 0) ||
						permissions.canRemoveWorkspaceMembers ? (
							<TableHeader className="relative w-0">
								<span className="sr-only">Actions</span>
							</TableHeader>
						) : null}
					</TableRow>
				</TableHead>
				<TableBody>
					{workspace.users.length > 0 ? (
						workspace.users?.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className="inline-flex items-center gap-3">
										<Avatar src={user.profile_photo_url} alt={user.name} user={user} className="size-8" />
										<p className="text-[var(--text-strong-950)]">{user.name}</p>
									</div>
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{displayableRole(user.membership.role)}</TableCell>
								<TableCell>
									<div className="-mx-3 -my-1.5 sm:-mx-2.5">
										<Dropdown>
											<DropdownButton $color="neutral" $variant="ghost" $size="xs" aria-label="Actions">
												<More2Icon className="size-5" />
											</DropdownButton>
											<DropdownMenu anchor="bottom end">
												{permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
													<DropdownItem onClick={() => setEdit(`update:workspace-members:${user.id}`)}>
														<ShieldUserIcon />
														<DropdownLabel>Update role</DropdownLabel>
													</DropdownItem>
												) : null}

												{permissions.canRemoveWorkspaceMembers ? (
													<DropdownItem onClick={() => setEdit(`destroy:workspace-members:${user.id}`)}>
														<UserMinusIcon />
														<DropdownLabel>Remove member</DropdownLabel>
													</DropdownItem>
												) : null}
											</DropdownMenu>
										</Dropdown>

										{permissions.canAddWorkspaceMembers && availableRoles.length > 0 ? (
											<ManageRoleDialog workspace={workspace} user={user} availableRoles={availableRoles} />
										) : null}

										{permissions.canRemoveWorkspaceMembers ? (
											<RemoveMemberDialog workspace={workspace} user={user} />
										) : null}
									</div>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex justify-center py-12">
									<p className="text-[var(--text-sub-600)] text-paragraph-sm">
										There are no members in this workspace yet.
									</p>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</ActionSection>
	);
}

function ManageRoleDialog({
	workspace,
	user,
	availableRoles,
}: {
	workspace: Workspace;
	user: UserMembership;
	availableRoles: Role[];
}) {
	const [action, setAction] = useQueryState("action");
	const form = useForm({
		role: user.membership.role,
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.put(route("workspace-members.update", [workspace.id, user.id]), {
			preserveScroll: true,
			onSuccess: async () => {
				form.reset();
				await setAction(null);
			},
		});
	}

	return (
		<Dialog open={action === `update:workspace-members:${user.id}`} onClose={() => setAction(null)}>
			<DialogHeader>
				<DialogIcon>
					<FolderShield2Icon className="size-6 text-[var(--icon-sub-600)]" />
				</DialogIcon>

				<div className="flex flex-1 flex-col gap-1">
					<DialogTitle>Manage role</DialogTitle>
					<DialogDescription>Select the new role for this workspace member.</DialogDescription>
				</div>
			</DialogHeader>

			<DialogBody>
				<form id={`update-workspace-members-role-${user.id}-form`} onSubmit={onSubmit}>
					<Field>
						<Label>Role</Label>
						<Select
							name="role"
							invalid={!!form.errors.role}
							onChange={(e) => form.setData("role", e.target.value)}
							value={form.data.role}
						>
							{availableRoles.map((role) => (
								<option key={role.key} value={role.key}>
									{role.name}
								</option>
							))}
						</Select>
						{form.errors.role && <ErrorMessage>{form.errors.role}</ErrorMessage>}
					</Field>
				</form>
			</DialogBody>

			<DialogActions>
				<Button
					$color="neutral"
					$variant="stroke"
					$size="sm"
					disabled={form.processing}
					className="w-full"
					onClick={() => setAction(null)}
				>
					Cancel
				</Button>
				<Button
					$size="sm"
					disabled={form.processing}
					form={`manage-role-form-${user.id}`}
					type="submit"
					className="w-full"
				>
					{form.processing ? "Updating..." : "Update role"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function RemoveMemberDialog({ workspace, user }: { workspace: Workspace; user: UserMembership }) {
	const [action, setAction] = useQueryState("action");
	const form = useForm({});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();

		form.delete(route("workspace-members.destroy", [workspace.id, user.id]), {
			errorBag: "removeWorkspaceMember",
			preserveScroll: true,
			preserveState: true,
			onSuccess: async () => {
				form.reset();
				await setAction(null);
			},
		});
	}

	return (
		<Dialog open={action === `destroy:workspace-members:${user.id}`} onClose={() => setAction(null)}>
			<DialogHeader>
				<DialogIcon>
					<EraserIcon className="size-6 text-[var(--icon-sub-600)]" />
				</DialogIcon>

				<div className="flex flex-1 flex-col gap-1">
					<DialogTitle>Remove workspace member</DialogTitle>
					<DialogDescription>Are you sure you would like to remove this person from the workspace?</DialogDescription>
				</div>
			</DialogHeader>

			<DialogBody>
				<form id={`destroy-workspace-members-${user.id}-form`} onSubmit={onSubmit} className="sr-only" />
			</DialogBody>

			<DialogActions>
				<Button
					$color="neutral"
					$variant="stroke"
					$size="sm"
					disabled={form.processing}
					className="w-full"
					onClick={() => setAction(null)}
				>
					Cancel
				</Button>
				<Button
					$color="error"
					$size="sm"
					disabled={form.processing}
					form={`remove-member-form-${user.id}`}
					type="submit"
					className="w-full"
				>
					{form.processing ? "Removing..." : "Yes, remove it"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
