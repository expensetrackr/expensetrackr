import { Head } from "@inertiajs/react";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";

import { Header } from "#/components/header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { SetPasswordForm } from "#/pages/settings/privacy-and-security/partials/set-password-form.tsx";
import { type PageProps } from "#/types/globals.js";
import { DeleteUserForm } from "./partials/delete-user-form.tsx";
import { LogoutOtherBrowserSessionsForm } from "./partials/logout-other-browser-sessions-form.tsx";
import { TwoFactorAuthenticationForm } from "./partials/two-factor-authentication-form.tsx";
import { UpdatePasswordForm } from "./partials/update-password-form.tsx";

type PrivacyAndSecurityShowProps = {
    sessions: App.Data.SessionData[];
    confirmsTwoFactorAuthentication: boolean;
};

export default function PrivacyAndSecurityShow({
    sessions,
    confirmsTwoFactorAuthentication,
    ...props
}: PageProps<PrivacyAndSecurityShowProps>) {
    const workspaces = props.workspaces;
    const canUpdatePassword = workspaces?.canUpdatePassword && props.socialstream.hasPassword;

    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                {workspaces?.canUpdatePassword && (
                    <>{canUpdatePassword ? <UpdatePasswordForm /> : <SetPasswordForm />}</>
                )}

                {workspaces?.canManageTwoFactorAuthentication && (
                    <>
                        <Divider.Root $type="line-spacing" />

                        <TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
                    </>
                )}

                <Divider.Root $type="line-spacing" />

                <LogoutOtherBrowserSessionsForm sessions={sessions} />

                {workspaces?.hasAccountDeletionFeatures && (
                    <>
                        <Divider.Root $type="line-spacing" />

                        <DeleteUserForm />
                    </>
                )}
            </div>
        </>
    );
}

PrivacyAndSecurityShow.layout = (page: React.ReactNode & { props: PageProps<PrivacyAndSecurityShowProps> }) => (
    <SettingsLayout {...page.props}>
        <Head title="Privacy & Security" />

        <Header
            description="Personalize your privacy settings and enhance the security of your account."
            icon={
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--bg-white-0) shadow-xs ring-1 ring-(--stroke-soft-200) ring-inset">
                    <ShieldUserIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Privacy & Security"
        />

        {page}
    </SettingsLayout>
);
