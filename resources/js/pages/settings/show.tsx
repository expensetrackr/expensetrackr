import { Head } from "@inertiajs/react";
import UserIcon from "virtual:icons/ri/user-line";

import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type InertiaSharedProps } from "#/types/index.ts";
import { UpdateEmailForm } from "./partials/update-email-form.tsx";
import { UpdateNameForm } from "./partials/update-name-form.tsx";
import { UpdateProfilePictureForm } from "./partials/update-profile-picture-form.tsx";

export default function SettingsShow() {
    return (
        <>
            <Divider.Root />

            <UpdateProfilePictureForm />

            <Divider.Root />

            <UpdateNameForm />

            <Divider.Root />

            <UpdateEmailForm />
        </>
    );
}

SettingsShow.layout = (page: React.ReactNode & { props: InertiaSharedProps }) => (
    <SettingsLayout
        {...page.props}
        description="Customize and edit essential profile details."
        icon={UserIcon}
        title="Profile Settings"
    >
        <Head title="Profile settings" />

        {page}
    </SettingsLayout>
);
