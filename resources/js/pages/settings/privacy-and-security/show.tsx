import { Head } from "@inertiajs/react";
import ShieldUserIcon from "virtual:icons/ri/shield-user-line";

import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { SetPasswordForm } from "#/pages/settings/privacy-and-security/partials/set-password-form.tsx";
import { type InertiaSharedProps, type Session } from "#/types/index.ts";
import { DeleteUserForm } from "./partials/delete-user-form.tsx";
import { LogoutOtherBrowserSessionsForm } from "./partials/logout-other-browser-sessions-form.tsx";
import { TwoFactorAuthenticationForm } from "./partials/two-factor-authentication-form.tsx";
import { UpdatePasswordForm } from "./partials/update-password-form.tsx";

type PrivacyAndSecurityShowProps = {
    sessions: Session[];
    confirmsTwoFactorAuthentication: boolean;
};

export default function PrivacyAndSecurityShow({
    sessions,
    confirmsTwoFactorAuthentication,
    ...props
}: InertiaSharedProps<PrivacyAndSecurityShowProps>) {
    const workspaces = props.workspaces;
    const canUpdatePassword = workspaces.canUpdatePassword && props.socialstream.hasPassword;

    return (
        <>
            {workspaces.canUpdatePassword && (
                <>
                    <Divider.Root />

                    {canUpdatePassword ? <UpdatePasswordForm /> : <SetPasswordForm />}
                </>
            )}

            {workspaces.canManageTwoFactorAuthentication && (
                <>
                    <Divider.Root />

                    <TwoFactorAuthenticationForm requiresConfirmation={confirmsTwoFactorAuthentication} />
                </>
            )}

            <Divider.Root />

            <LogoutOtherBrowserSessionsForm sessions={sessions} />

            {workspaces.hasAccountDeletionFeatures && (
                <>
                    <Divider.Root />

                    <DeleteUserForm />
                </>
            )}
        </>
    );
}

PrivacyAndSecurityShow.layout = (
    page: React.ReactNode & { props: InertiaSharedProps<PrivacyAndSecurityShowProps> },
) => (
    <SettingsLayout
        {...page.props}
        description="Personalize your privacy settings and enhance the security of your account."
        icon={ShieldUserIcon}
        title="Privacy & Security"
    >
        <Head title="Privacy & Security" />

        {page}
    </SettingsLayout>
);
