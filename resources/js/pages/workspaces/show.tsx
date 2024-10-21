import PlanetIcon from "virtual:icons/ri/planet-line";
import { Head } from "@inertiajs/react";

import { Divider } from "#/components/divider";
import { PageHeader } from "#/components/page-header";
import { AppLayout } from "#/layouts/app-layout";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar";
import type { Role, User, Workspace, WorkspaceInvitation, WorkspacePermissions } from "#/types";
import { UpdateWorkspaceNameForm } from "./partials/update-workspace-name-form";

interface UserMembership extends User {
	membership: {
		role: string;
	};
}

interface UpdateWorkspaceNameFormProps {
	workspace: Workspace & {
		owner: User;
		workspace_invitations: WorkspaceInvitation[];
		users: UserMembership[];
	};
	availableRoles: Role[];
	permissions: WorkspacePermissions;
}

export default function WorkspacesShow({ workspace, availableRoles, permissions }: UpdateWorkspaceNameFormProps) {
	return (
		<AppLayout subSidebar={<SettingsSidebar />}>
			<Head title="Workspace settings" />

			<PageHeader>
				<PageHeader.Content>
					<PageHeader.Icon>
						<PlanetIcon className="size-6" />
					</PageHeader.Icon>

					<div className="flex flex-1 flex-col gap-1">
						<PageHeader.Title>Workspace settings</PageHeader.Title>
						<PageHeader.Description>Customize and edit essential workspace details.</PageHeader.Description>
					</div>
				</PageHeader.Content>
			</PageHeader>

			<Divider />

			<UpdateWorkspaceNameForm workspace={workspace} permissions={permissions} />
		</AppLayout>
	);
}
