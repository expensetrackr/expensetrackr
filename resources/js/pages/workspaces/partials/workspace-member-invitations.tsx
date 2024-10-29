import DeleteBinIcon from "virtual:icons/ri/delete-bin-line";
import { router } from "@inertiajs/react";
import { useState } from "react";

import { ActionSection } from "#/components/action-section";
import { Button } from "#/components/button";
import { Dialog, DialogActions, DialogDescription, DialogHeader, DialogIcon, DialogTitle } from "#/components/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/table";
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
			description="These people have been invited to your workspace and have been sent an invitation email. They may join the workspace by accepting the email invitation."
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
										<CancelInvitation invitation={invitation} />
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

function CancelInvitation({ invitation }: { invitation: WorkspaceInvitation }) {
	const [isOpen, setOpen] = useState(false);
	const [isCancelling, setCancelling] = useState(false);

	function cancelWorkspaceInvitation(invitation: WorkspaceInvitation) {
		setCancelling(true);
		router.delete(route("workspace-invitations.destroy", [invitation]), {
			preserveScroll: true,
		});

		setOpen(false);
		setCancelling(false);
	}

	return (
		<>
			<Button $color="error" $variant="stroke" $size="sm" onClick={() => setOpen(true)}>
				Cancel invitation
			</Button>

			<Dialog open={isOpen} onClose={setOpen}>
				<DialogHeader>
					<DialogIcon>
						<DeleteBinIcon className="size-6 text-[var(--icon-sub-600)]" />
					</DialogIcon>

					<div className="flex flex-1 flex-col gap-1">
						<DialogTitle>Cancel invitation</DialogTitle>
						<DialogDescription>Are you sure you want to cancel this invitation?</DialogDescription>
					</div>
				</DialogHeader>

				<DialogActions>
					<Button
						$color="neutral"
						$variant="stroke"
						$size="sm"
						className="w-full"
						disabled={isCancelling}
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
					<Button
						$color="error"
						$size="sm"
						className="w-full"
						disabled={isCancelling}
						onClick={() => cancelWorkspaceInvitation(invitation)}
					>
						{isCancelling ? "Cancelling..." : "Cancel invitation"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
