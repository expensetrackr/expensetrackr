import { Head } from "@inertiajs/react";
import UserIcon from "virtual:icons/ri/user-line";

import { Divider } from "#/components/divider.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { AppLayout } from "#/layouts/app-layout.tsx";
import { SettingsSidebar } from "#/layouts/partials/settings-sidebar.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { UpdateEmailForm } from "./partials/update-email-form.tsx";
import { UpdateNameForm } from "./partials/update-name-form.tsx";
import { UpdateProfilePictureForm } from "./partials/update-profile-picture-form.tsx";

export default function SettingsShow() {
    return (
        <>
            <Head title="Profile settings" />

            <div className="flex flex-col gap-5">
                <PageHeader className="-mb-5">
                    <PageHeader.Content>
                        <PageHeader.Icon>
                            <UserIcon className="size-6" />
                        </PageHeader.Icon>

                        <div className="flex flex-1 flex-col gap-1">
                            <PageHeader.Title>Profile Settings</PageHeader.Title>
                            <PageHeader.Description>
                                Customize and edit essential profile details.
                            </PageHeader.Description>
                        </div>
                    </PageHeader.Content>
                </PageHeader>

                <Divider />

                <UpdateProfilePictureForm />

                <Divider />

                <UpdateNameForm />

                <Divider />

                <UpdateEmailForm />
            </div>
        </>
    );
}

SettingsShow.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <AppLayout {...page.props} subSidebar={<SettingsSidebar />}>
        {page}
    </AppLayout>
);
