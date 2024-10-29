import { ActionSection } from "#/components/action-section";
import { Button } from "#/components/button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table.tsx";
import type { User, Workspace, WorkspaceInvitation, WorkspacePermissions } from "#/types";

interface UserMembership extends User {
	membership: {
		role: string;
	};
}

interface WorkspaceMemberInvitationsProps {
	workspace: Workspace & {
		owner: User;
		workspace_invitations: WorkspaceInvitation[];
		users: UserMembership[];
	};
	permissions: WorkspacePermissions;
}

export function WorkspaceMemberInvitations({ workspace, permissions }: WorkspaceMemberInvitationsProps) {
	return (
		<ActionSection
			title="Pending workspace invitations"
			description="These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation."
		>
			<Table bleed>
				<TableHead>
					<TableRow>
						<TableHeader>Email address</TableHeader>
						{permissions.canRemoveWorkspaceMembers ? (
							<TableHeader className="relative w-0">
								<span className="sr-only">Actions</span>
							</TableHeader>
						) : null}
					</TableRow>
				</TableHead>
				<TableBody>
					{workspace.workspace_invitations.length > 0 ? (
						workspace.workspace_invitations?.map((invitation) => (
							<TableRow key={invitation.id}>
								<TableCell>{invitation.email}</TableCell>
								{permissions.canRemoveWorkspaceMembers ? (
									<TableCell>
										<Button $color="error" $variant="stroke" $size="sm">
											Cancel invitation
										</Button>
									</TableCell>
								) : null}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex justify-center py-12">
									<p className="text-[var(--text-sub-600)] text-paragraph-sm">There are no pending invitations.</p>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</ActionSection>
	);
}
