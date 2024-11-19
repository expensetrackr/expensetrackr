import { Head } from "@inertiajs/react";
import PlanetIcon from "virtual:icons/ri/planet-line";

import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar.tsx";
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
            <Head title="Workspace settings" />

            <div className="flex flex-col gap-5">
                <PageHeader className="-mb-5">
                    <PageHeader.Content>
                        <PageHeader.Icon>
                            <PlanetIcon className="size-6" />
                        </PageHeader.Icon>

                        <div className="flex flex-1 flex-col gap-1">
                            <PageHeader.Title>Workspace settings</PageHeader.Title>
                            <PageHeader.Description>
                                Customize and edit essential workspace details.
                            </PageHeader.Description>
                        </div>
                    </PageHeader.Content>
                </PageHeader>

                <Divider />

                <UpdateWorkspaceNameForm permissions={permissions} workspace={workspace} />

                <Divider />

                <WorkspaceMemberManager
                    availableRoles={availableRoles}
                    permissions={permissions}
                    workspace={workspace}
                />

                <Divider />

                <WorkspaceMemberInvitations permissions={permissions} workspace={workspace} />
            </div>
        </>
    );
}

WorkspacesShow.layout = (page: React.ReactNode & { props: InertiaSharedProps<WorkspacesShowProps> }) => (
    <AppLayout {...page.props} subSidebar={<SettingsSidebar />}>
        {page}
    </AppLayout>
);
