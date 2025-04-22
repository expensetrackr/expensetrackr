import { Head } from "@inertiajs/react";
import UserCircleSolidIcon from "virtual:icons/hugeicons/user-circle-solid";

import { UpdateEmailForm } from "#/components/forms/update-email-form.tsx";
import { UpdateNameForm } from "#/components/forms/update-name-form.tsx";
import { UpdateProfilePictureForm } from "#/components/forms/update-profile-picture-form.tsx";
import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.js";

export default function SettingsShow() {
    return (
        <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
            <UpdateProfilePictureForm />

            <Divider.Root $type="line-spacing" />

            <UpdateNameForm />

            <Divider.Root $type="line-spacing" />

            <UpdateEmailForm />
        </div>
    );
}

SettingsShow.layout = (page: React.ReactNode & { props: PageProps }) => (
    <SettingsLayout {...page.props}>
        <Head title="Profile settings" />

        <Header
            description="Customize and edit essential profile details."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <UserCircleSolidIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Profile settings"
        />

        <div className="px-4 lg:px-8">
            <Divider.Root />
        </div>

        {page}
    </SettingsLayout>
);
