import { Head } from "@inertiajs/react";
import SecurityLockSolidIcon from "virtual:icons/hugeicons/security-lock-solid";

import { DeleteUserForm } from "#/components/forms/delete-user-form.tsx";
import { LogoutOtherBrowserSessionsForm } from "#/components/forms/logout-other-browser-sessions-form.tsx";
import { SetPasswordForm } from "#/components/forms/set-password-form.tsx";
import { TwoFactorAuthenticationForm } from "#/components/forms/two-factor-authentication-form.tsx";
import { UpdatePasswordForm } from "#/components/forms/update-password-form.tsx";
import { Header } from "#/components/page-header.tsx";
import * as Divider from "#/components/ui/divider.tsx";
import { SettingsLayout } from "#/layouts/settings-layout.tsx";
import { type PageProps } from "#/types/globals.js";

type PrivacyAndSecurityShowProps = {
    sessions: App.Data.Auth.SessionData[];
    confirmsTwoFactorAuthentication: boolean;
    recoveryCodes: string[];
};

export default function PrivacyAndSecurityShow({
    sessions,
    confirmsTwoFactorAuthentication,
    recoveryCodes,
    ...props
}: PageProps<PrivacyAndSecurityShowProps>) {
    const permissions = props.permissions;
    const features = props.features;
    const canUpdatePassword = permissions?.canUpdatePassword && props.socialstream.hasPassword;

    return (
        <>
            <div className="px-4 lg:px-8">
                <Divider.Root />
            </div>

            <div className="flex w-full flex-col gap-5 px-4 py-6 lg:px-8">
                {permissions?.canUpdatePassword && (
                    <>{canUpdatePassword ? <UpdatePasswordForm /> : <SetPasswordForm />}</>
                )}

                {permissions?.canManageTwoFactorAuthentication && (
                    <>
                        <Divider.Root $type="line-spacing" />

                        <TwoFactorAuthenticationForm
                            recoveryCodes={recoveryCodes}
                            requiresConfirmation={confirmsTwoFactorAuthentication}
                        />
                    </>
                )}

                <Divider.Root $type="line-spacing" />

                <LogoutOtherBrowserSessionsForm sessions={sessions} />

                {features?.hasAccountDeletionFeatures && (
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
                    <SecurityLockSolidIcon className="size-6 text-(--text-sub-600)" />
                </div>
            }
            title="Privacy & Security"
        />

        {page}
    </SettingsLayout>
);
