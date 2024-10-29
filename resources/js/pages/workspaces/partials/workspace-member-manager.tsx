import { ActionSection } from "#/components/action-section";
import { Avatar } from "#/components/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table";
import type { Role, User, Workspace, WorkspaceInvitation, WorkspacePermissions } from "#/types";
import { AddWorkspaceMemberForm } from "./add-workspace-member-form";

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
					</TableRow>
				</TableHead>
				<TableBody>
					{workspace.users.length > 0 ? (
						workspace.users?.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className="inline-flex items-center gap-3">
										<Avatar src={user.profile_photo_url} alt={user.name} />
										<p className="text-[var(--text-strong-950)]">{user.name}</p>
									</div>
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{displayableRole(user.membership.role)}</TableCell>
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
