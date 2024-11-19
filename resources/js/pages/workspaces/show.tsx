import { Head } from "@inertiajs/react";
import PlanetIcon from "virtual:icons/ri/planet-line";

import { Divider } from "#/components/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { WorkspaceMemberInvitations } from "#/pages/workspaces/partials/workspace-member-invitations.tsx";
import {
    type InertiaSharedProps,
    type Role,
    type User,
    type Workspace,
    type WorkspaceInvitation,
    type WorkspacePermissions,
} from "#/types/index.ts";
import { UpdateWorkspaceNameForm } from "./partials/update-workspace-name-form.tsx";
import { WorkspaceMemberManager } from "./partials/workspace-member-manager.tsx";

interface UserMembership extends User {
    membership: {
        role: string;
    };
}

type WorkspacesShowProps = {
    workspace: Workspace & {
        owner: User;
        workspace_invitations: WorkspaceInvitation[];
        users: UserMembership[];
    };
    availableRoles: Role[];
    permissions: WorkspacePermissions;
};

export default function WorkspacesShow({
    workspace,
    availableRoles,
    permissions,
}: InertiaSharedProps<WorkspacesShowProps>) {
    return (
        <>
            <Divider />

            <UpdateWorkspaceNameForm permissions={permissions} workspace={workspace} />

            <Divider />

            <WorkspaceMemberManager availableRoles={availableRoles} permissions={permissions} workspace={workspace} />

            <Divider />

            <WorkspaceMemberInvitations permissions={permissions} workspace={workspace} />
        </>
    );
}

WorkspacesShow.layout = (page: React.ReactNode & { props: InertiaSharedProps<WorkspacesShowProps> }) => (
    <SettingsLayout
        {...page.props}
        description="Customize and edit essential workspace details."
        icon={PlanetIcon}
        title="Workspace settings"
    >
        <Head title="Workspace settings" />

        {page}
    </SettingsLayout>
);
