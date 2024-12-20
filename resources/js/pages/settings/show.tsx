import { Head } from "@inertiajs/react";
import UserSettingsIcon from "virtual:icons/ri/user-settings-line";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { UpdateEmailForm } from "./partials/update-email-form.tsx";
import { UpdateNameForm } from "./partials/update-name-form.tsx";
import { UpdateProfilePictureForm } from "./partials/update-profile-picture-form.tsx";

export default function SettingsShow() {
    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                <UpdateProfilePictureForm />

                <Divider.Root $type="line-spacing" />

                <UpdateNameForm />

                <Divider.Root $type="line-spacing" />

                <UpdateEmailForm />
            </div>
        </>
    );
}

SettingsShow.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <SettingsLayout {...page.props}>
        <Head title="Profile settings" />

        <Header
            description="Customize and edit essential profile details."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) ring-1 shadow-xs ring-(--stroke-soft-200) ring-inset">
                    <UserSettingsIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Profile Settings"
        />

        {page}
    </SettingsLayout>
);
