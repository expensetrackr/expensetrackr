import { Head } from "@inertiajs/react";
import UserGroupSolidIcon from "virtual:icons/hugeicons/user-group-solid";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { WorkspaceMemberInvitations } from "#/pages/workspaces/partials/workspace-member-invitations.tsx";
import { WorkspaceSettingsForm } from "./__components/workspace-settings-form.tsx";
import { UpdateWorkspaceNameForm } from "./partials/update-workspace-name-form.tsx";
import { WorkspaceMemberManager } from "./partials/workspace-member-manager.tsx";

type WorkspacesShowProps = {
    workspace: App.Data.Workspace.WorkspaceData;
    availableRoles: Array<{ name: string }>;
    permissions: App.Data.Workspace.WorkspacePermissionsData;
};

export default function WorkspacesShow({ workspace, availableRoles, permissions }: WorkspacesShowProps) {
    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                <UpdateWorkspaceNameForm
                    defaultValues={{
                        id: workspace.id,
                        name: workspace.name,
                    }}
                    permissions={permissions}
                />

                <Divider.Root $type="line-spacing" />

                <WorkspaceSettingsForm defaultValues={workspace.settings} workspaceId={workspace.id} />

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

WorkspacesShow.layout = (page: React.ReactNode & { props: App.Data.Shared.SharedInertiaData }) => (
    <SettingsLayout {...page.props}>
        <Head title="Workspace settings" />

        <Header
            description="Customize and edit essential workspace details."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <UserGroupSolidIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Workspace settings"
        />

        {page}
    </SettingsLayout>
);
