import { Head } from "@inertiajs/react";
import PlanetIcon from "virtual:icons/ri/planet-line";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { WorkspaceMemberInvitations } from "#/pages/workspaces/partials/workspace-member-invitations.tsx";
import { UpdateWorkspaceNameForm } from "./partials/update-workspace-name-form.tsx";
import { WorkspaceMemberManager } from "./partials/workspace-member-manager.tsx";

interface UserMembership extends App.Data.UserData {
    membership: {
        role: string;
    };
}

type WorkspacesShowProps = {
    workspace: App.Data.WorkspaceData & {
        owner: App.Data.UserData;
        invitations: App.Data.WorkspaceInvitationData[];
        members: UserMembership[];
    };
    availableRoles: Array<{ name: string }>;
    permissions: App.Data.WorkspacePermissionsData;
};

export default function WorkspacesShow({ workspace, availableRoles, permissions }: WorkspacesShowProps) {
    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                <UpdateWorkspaceNameForm permissions={permissions} workspace={workspace} />

                <Divider.Root $type="line-spacing" />

                <WorkspaceMemberManager
                    availableRoles={availableRoles}
                    permissions={permissions}
                    workspace={workspace}
                />

                <Divider.Root $type="line-spacing" />

                <WorkspaceMemberInvitations permissions={permissions} workspace={workspace} />
            </div>
        </>
    );
}

WorkspacesShow.layout = (page: React.ReactNode & { props: App.Data.SharedInertiaData }) => (
    <SettingsLayout {...page.props}>
        <Head title="Workspace settings" />

        <Header
            description="Customize and edit essential workspace details."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <PlanetIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Workspace settings"
        />

        {page}
    </SettingsLayout>
);
